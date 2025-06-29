// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/shared/interfaces/AggregatorV3Interface.sol";

contract PiqselNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    AggregatorV3Interface internal priceFeed;

    enum AdSpaceStatus { Available, Rented, Paused }

    struct SpaceDetails {
        address owner;
        string websiteURL;
        string pageURL;
        string spaceType;
        string spaceId;
        string category;
        uint256 height;
        uint256 width;
        string[] tags;
        uint256 hourlyRentalRate; // in USD (no decimals)
        AdSpaceStatus status;
    }

    struct RentalInfo {
        string websiteURL;
        address renter;
        uint256 startTime;
        uint256 endTime;
        string adMetadataURI;
    }

    struct PaymentDetails {
        uint256 usdToPublisher;
        uint256 ethToPublisher;
        uint256 ethFee;
        uint256 totalEthRequired;
    }

    mapping(uint256 => SpaceDetails) public adSpaces;
    mapping(uint256 => RentalInfo[]) public rentals;

    uint256 public platformFeePercent = 5;
    address public protocolTreasury;

    event AdSpaceMinted(address indexed publisher, uint256 indexed tokenId, string websiteURL, string spaceId);
    event AdRented(
        uint256 indexed tokenId,
        address indexed renter,
        uint256 startTime,
        uint256 endTime,
        uint256 usdToPublisher,
        string websiteURL,
        string adMetadataURI
    );

    constructor(address _priceFeed) ERC721("PiqselNFT", "PIXL") Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        protocolTreasury = msg.sender;
    }

    function mintAdSpace(
        string memory websiteURL,
        string memory pageURL,
        string memory spaceType,
        string memory spaceId,
        string memory category,
        string memory tokenURI,
        uint256 height,
        uint256 width,
        uint256 hourlyRentalRate,
        string[] memory tags
    ) external {
        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        adSpaces[tokenId] = SpaceDetails({
            owner: msg.sender,
            websiteURL: websiteURL,
            pageURL: pageURL,
            spaceType: spaceType,
            spaceId: spaceId,
            category: category,
            height: height,
            width: width,
            tags: tags,
            hourlyRentalRate: hourlyRentalRate,
            status: AdSpaceStatus.Available
        });

        emit AdSpaceMinted(msg.sender, tokenId, websiteURL, spaceId);
    }

    function rentAdSpace(
        uint256 tokenId,
        uint256 startTime,
        uint256 endTime,
        string memory websiteURL,
        string memory adMetadataURI
    ) external payable {
        require(startTime < endTime, "Invalid time range");
        require(startTime >= block.timestamp, "Start time must be in the future");

        AdSpaceStatus currentStatus = getAdSpaceStatus(tokenId);
        require(currentStatus != AdSpaceStatus.Paused, "Ad space is paused");

        _validateNoOverlap(tokenId, startTime, endTime);

        uint256 durationInSeconds = endTime - startTime;
        require(durationInSeconds >= 3600, "Minimum duration is 1 hour");

        uint256 hourlyRate = adSpaces[tokenId].hourlyRentalRate;
        uint256 totalUsdAmount = ((hourlyRate * 1e18) / 3600) * durationInSeconds;

        PaymentDetails memory pd = _handlePayment(totalUsdAmount);

        require(msg.value >= pd.totalEthRequired, "Insufficient ETH sent");

        _safeTransferETH(adSpaces[tokenId].owner, pd.ethToPublisher, "Publisher payment failed");
        _safeTransferETH(protocolTreasury, pd.ethFee, "Protocol fee payment failed");

        if (msg.value > pd.totalEthRequired) {
            _safeTransferETH(msg.sender, msg.value - pd.totalEthRequired, "Refund failed");
        }

        rentals[tokenId].push(RentalInfo({
            websiteURL: websiteURL,
            renter: msg.sender,
            startTime: startTime,
            endTime: endTime,
            adMetadataURI: adMetadataURI
        }));

        emit AdRented(tokenId, msg.sender, startTime, endTime, pd.usdToPublisher, websiteURL, adMetadataURI);
    }

    function _validateNoOverlap(uint256 tokenId, uint256 startTime, uint256 endTime) internal view {
        RentalInfo[] storage booked = rentals[tokenId];
        for (uint i = 0; i < booked.length; i++) {
            bool overlaps = !(endTime <= booked[i].startTime || startTime >= booked[i].endTime);
            require(!overlaps, "Selected time overlaps with existing rental");
        }
    }

    function _handlePayment(uint256 totalUsdAmount)
        internal
        view
        returns (PaymentDetails memory)
    {
        uint256 usdFee = (totalUsdAmount * platformFeePercent) / 100;
        uint256 usdToPublisher = totalUsdAmount - usdFee;

        uint256 ethFee = getETHAmountForUSD(usdFee);
        uint256 ethToPublisher = getETHAmountForUSD(usdToPublisher);
        uint256 totalEthRequired = ethFee + ethToPublisher;

        return PaymentDetails({
            usdToPublisher: usdToPublisher,
            ethToPublisher: ethToPublisher,
            ethFee: ethFee,
            totalEthRequired: totalEthRequired
        });
    }

    function _safeTransferETH(address to, uint256 amount, string memory errorMessage) internal {
        if (amount > 0) {
            (bool success, ) = payable(to).call{value: amount}("");
            require(success, errorMessage);
        }
    }

    function getCurrentAd(uint256 tokenId) external view returns (string memory) {
        RentalInfo[] storage r = rentals[tokenId];
        for (uint i = 0; i < r.length; i++) {
            if (block.timestamp >= r[i].startTime && block.timestamp < r[i].endTime) {
                return r[i].adMetadataURI;
            }
        }
        return "No Active Ad";
    }

    function getTimeRemaining(uint256 tokenId) external view returns (uint256) {
        RentalInfo[] storage r = rentals[tokenId];
        for (uint i = 0; i < r.length; i++) {
            if (block.timestamp >= r[i].startTime && block.timestamp < r[i].endTime) {
                return r[i].endTime - block.timestamp;
            }
        }
        return 0;
    }

    function getTimeRemainingInHoursWith18Decimals(uint256 tokenId) external view returns (uint256) {
        RentalInfo[] storage r = rentals[tokenId];
        for (uint i = 0; i < r.length; i++) {
            if (block.timestamp >= r[i].startTime && block.timestamp < r[i].endTime) {
                return ((r[i].endTime - block.timestamp) * 1e18) / 3600;
            }
        }
        return 0;
    }

    function getAdSpaceStatus(uint256 tokenId) public view returns (AdSpaceStatus) {
        if (adSpaces[tokenId].status == AdSpaceStatus.Paused) {
            return AdSpaceStatus.Paused;
        }

        RentalInfo[] storage r = rentals[tokenId];
        for (uint i = 0; i < r.length; i++) {
            if (block.timestamp >= r[i].startTime && block.timestamp < r[i].endTime) {
                return AdSpaceStatus.Rented;
            }
        }
        return AdSpaceStatus.Available;
    }

    function getAdSpace(uint256 tokenId) external view returns (SpaceDetails memory) {
        return adSpaces[tokenId];
    }

    function getAllRentals(uint256 tokenId) external view returns (RentalInfo[] memory) {
        return rentals[tokenId];
    }

    function setAdSpaceStatus(uint256 tokenId, AdSpaceStatus _status) external {
        require(ownerOf(tokenId) == msg.sender, "Not the ad space owner");
        adSpaces[tokenId].status = _status;
    }

    function getETHAmountForUSD(uint256 usdAmountIn18Decimals) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid Chainlink price");
        return (usdAmountIn18Decimals * 1e18) / (uint256(price) * 1e10);
    }

    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 100, "Invalid fee percent");
        platformFeePercent = _feePercent;
    }

    function setProtocolTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        protocolTreasury = _treasury;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}