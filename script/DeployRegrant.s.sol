// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Regrant.sol";

contract DeployRegrant is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the Regrant contract
        Regrant regrant = new Regrant();

        // Stop broadcasting transactions
        vm.stopBroadcast();

        // Log the contract address
        console.log("Regrant deployed at:", address(regrant));
    }
}