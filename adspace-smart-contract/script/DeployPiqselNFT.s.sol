// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PiqselNFT.sol";

contract DeployPiqselNFT is Script {
    function run() external {
        address priceFeed = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
        vm.startBroadcast();
        PiqselNFT piqselNFT = new PiqselNFT(priceFeed);
        vm.stopBroadcast();
        console.log("PiqselNFT deployed to:", address(piqselNFT));
    }
}