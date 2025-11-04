// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyNFT.sol";

contract DeployMyNFT is Script {
    function run() public returns (MyNFT) {
        vm.startBroadcast();
        MyNFT myNFT = new MyNFT();
        vm.stopBroadcast();
        return myNFT;
    }
}
