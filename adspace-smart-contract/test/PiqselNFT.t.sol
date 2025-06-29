// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PiqselNFT.sol";
import "@chainlink/shared/interfaces/AggregatorV3Interface.sol";

contract MockPriceFeed is AggregatorV3Interface {
    function decimals() external pure override returns (uint8) {
        return 8;
    }

    function description() external pure override returns (string memory) {
        return "ETH / USD";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function getRoundData(uint80)
        external
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, 2000 * 1e8, 0, 0, 0); // $2000 per ETH
    }

    function latestRoundData()
        external
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, 2000 * 1e8, 0, 0, 0); // $2000 per ETH
    }
}

contract PiqselNFTTest is Test {
    PiqselNFT nft;
    MockPriceFeed priceFeed;
    address owner = address(this);
    address publisher = address(0x123);
    address renter = address(0x456);
    address treasury = address(0x789);

    // Declare the event signature to match the one in PiqselNFT
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

    function setUp() public {
        priceFeed = new MockPriceFeed();
        nft = new PiqselNFT(address(priceFeed));
        vm.deal(publisher, 10 ether);
        vm.deal(renter, 10 ether);
        vm.deal(treasury, 10 ether);
        // Set protocolTreasury to an address that can receive ETH
        vm.prank(owner);
        nft.setProtocolTreasury(treasury);
    }

    
    function testMintAdSpace() public {
        string[] memory tags = new string[](2);
        tags[0] = "banner";
        tags[1] = "advertising";

        vm.prank(publisher);
        vm.expectEmit(true, true, false, true);
        emit AdSpaceMinted(publisher, 0, "https://example.com", "space1");
        nft.mintAdSpace(
            "https://example.com",
            "https://example.com/page",
            "banner",
            "space1",
            "advertising",
            "ipfs://tokenURI",
            300,
            250,
            10,
            tags
        );

        assertEq(nft.ownerOf(0), publisher, "Publisher should own token");
        assertEq(nft.tokenURI(0), "ipfs://tokenURI", "Incorrect token URI");
        assertEq(nft.nextTokenId(), 1, "nextTokenId should increment");

        PiqselNFT.SpaceDetails memory space = nft.getAdSpace(0);
        assertEq(space.owner, publisher, "Incorrect owner");
        assertEq(space.websiteURL, "https://example.com", "Incorrect website URL");
        assertEq(space.pageURL, "https://example.com/page", "Incorrect page URL");
        assertEq(space.spaceType, "banner", "Incorrect space type");
        assertEq(space.spaceId, "space1", "Incorrect space ID");
        assertEq(space.category, "advertising", "Incorrect category");
        assertEq(space.height, 300, "Incorrect height");
        assertEq(space.width, 250, "Incorrect width");
        assertEq(space.hourlyRentalRate, 10, "Incorrect hourly rate");
        assertEq(uint(space.status), uint(PiqselNFT.AdSpaceStatus.Available), "Incorrect status");
        assertEq(space.tags[0], "banner", "Incorrect tag[0]");
        assertEq(space.tags[1], "advertising", "Incorrect tag[1]");
    }

    

   

    function test_RevertWhen_RentAdSpaceInvalidTimeRange() public {
        string[] memory tags = new string[](1);
        tags[0] = "banner";
        vm.prank(publisher);
        nft.mintAdSpace(
            "https://example.com",
            "https://example.com/page",
            "banner",
            "space1",
            "advertising",
            "ipfs://tokenURI",
            300,
            250,
            10,
            tags
        );

        uint256 startTime = block.timestamp + 2 hours;
        uint256 endTime = startTime - 1 hours;

        vm.prank(renter);
        vm.expectRevert("Invalid time range");
        nft.rentAdSpace{value: 1 ether}(0, startTime, endTime, "https://ad.com", "ipfs://adURI");
    }

    

    function test_RevertWhen_RentAdSpacePaused() public {
        string[] memory tags = new string[](1);
        tags[0] = "banner";
        vm.prank(publisher);
        nft.mintAdSpace(
            "https://example.com",
            "https://example.com/page",
            "banner",
            "space1",
            "advertising",
            "ipfs://tokenURI",
            300,
            250,
            10,
            tags
        );

        vm.prank(publisher);
        nft.setAdSpaceStatus(0, PiqselNFT.AdSpaceStatus.Paused);

        uint256 startTime = block.timestamp + 1 hours;
        uint256 endTime = startTime + 2 hours;

        vm.prank(renter);
        vm.expectRevert("Ad space is paused");
        nft.rentAdSpace{value: 1 ether}(0, startTime, endTime, "https://ad.com", "ipfs://adURI");
    }

    function test_RevertWhen_RentAdSpaceOverlap() public {
        string[] memory tags = new string[](1);
        tags[0] = "banner";
        vm.prank(publisher);
        nft.mintAdSpace(
            "https://example.com",
            "https://example.com/page",
            "banner",
            "space1",
            "advertising",
            "ipfs://tokenURI",
            300,
            250,
            10,
            tags
        );

        uint256 startTime = block.timestamp + 1 hours;
        uint256 endTime = startTime + 2 hours;
        uint256 duration = 2 hours;
        uint256 usdAmount = (10 * 1e18 * duration) / 3600;
        uint256 usdFee = (usdAmount * 5) / 100;
        uint256 usdToPublisher = usdAmount - usdFee;
        uint256 ethFee = (usdFee * 1e18) / (2000 * 1e8 * 1e10);
        uint256 ethToPublisher = (usdToPublisher * 1e18) / (2000 * 1e8 * 1e10);
        uint256 totalEthRequired = ethFee + ethToPublisher;

        vm.prank(renter);
        nft.rentAdSpace{value: totalEthRequired}(
            0,
            startTime,
            endTime,
            "https://ad.com",
            "ipfs://adURI"
        );

        vm.prank(renter);
        vm.expectRevert("Selected time overlaps with existing rental");
        nft.rentAdSpace{value: totalEthRequired}(
            0,
            startTime + 1 hours,
            endTime + 1 hours,
            "https://ad2.com",
            "ipfs://adURI2"
        );
    }

    function testGetCurrentAd() public {
        string[] memory tags = new string[](1);
        tags[0] = "banner";
        vm.prank(publisher);
        nft.mintAdSpace(
            "https://example.com",
            "https://example.com/page",
            "banner",
            "space1",
            "advertising",
            "ipfs://tokenURI",
            300,
            250,
            10,
            tags
        );

        uint256 startTime = block.timestamp + 1 hours;
        uint256 endTime = startTime + 2 hours;
        uint256 duration = 2 hours;
        uint256 usdAmount = (10 * 1e18 * duration) / 3600;
        uint256 usdFee = (usdAmount * 5) / 100;
        uint256 usdToPublisher = usdAmount - usdFee;
        uint256 ethFee = (usdFee * 1e18) / (2000 * 1e8 * 1e10);
        uint256 ethToPublisher = (usdToPublisher * 1e18) / (2000 * 1e8 * 1e10);
        uint256 totalEthRequired = ethFee + ethToPublisher;

        vm.prank(renter);
        nft.rentAdSpace{value: totalEthRequired}(
            0,
            startTime,
            endTime,
            "https://ad.com",
            "ipfs://adURI"
        );

        vm.warp(startTime + 1 hours);
        assertEq(nft.getCurrentAd(0), "ipfs://adURI", "Incorrect current ad");
        vm.warp(endTime + 1 hours);
        assertEq(nft.getCurrentAd(0), "No Active Ad", "Should return no active ad");
    }

    function testSetAdSpaceStatus() public {
        string[] memory tags = new string[](1);
        tags[0] = "banner";
        vm.prank(publisher);
        nft.mintAdSpace(
            "https://example.com",
            "https://example.com/page",
            "banner",
            "space1",
            "advertising",
            "ipfs://tokenURI",
            300,
            250,
            10,
            tags
        );

        vm.prank(publisher);
        nft.setAdSpaceStatus(0, PiqselNFT.AdSpaceStatus.Paused);
        assertEq(uint(nft.getAdSpaceStatus(0)), uint(PiqselNFT.AdSpaceStatus.Paused), "Status should be paused");

        vm.prank(renter);
        vm.expectRevert("Not the ad space owner");
        nft.setAdSpaceStatus(0, PiqselNFT.AdSpaceStatus.Available);
    }

    function testSetPlatformFee() public {
        vm.prank(owner);
        nft.setPlatformFee(10);
        assertEq(nft.platformFeePercent(), 10, "Incorrect platform fee");

        vm.prank(owner);
        vm.expectRevert("Invalid fee percent");
        nft.setPlatformFee(101);
    }

    function testSetProtocolTreasury() public {
        vm.prank(owner);
        nft.setProtocolTreasury(treasury);
        assertEq(nft.protocolTreasury(), treasury, "Incorrect treasury address");

        vm.prank(owner);
        vm.expectRevert("Invalid treasury");
        nft.setProtocolTreasury(address(0));
    }

    
}