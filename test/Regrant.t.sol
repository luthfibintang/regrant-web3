// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Regrant.sol";

contract RegrantTest is Test {
    Regrant regrant;
    address platformProvider = address(0x1);
    address renter = address(0x2);
    address borrower = address(0x3);

    function setUp() public {
        // Deploy the Regrant contract
        vm.prank(platformProvider);
        regrant = new Regrant();
    }

    function testCreateTransaction() public {
        // Platform provider creates a transaction
        vm.prank(platformProvider);
        regrant.createTransaction(renter, borrower, 1 ether, 0.5 ether);

        // Check transaction details
        (address _renter, address _borrower, uint256 deposit, uint256 fee, , ) = regrant.transactions(1);
        assertEq(_renter, renter);
        assertEq(_borrower, borrower);
        assertEq(deposit, 1 ether);
        assertEq(fee, 0.5 ether);
    }

    function testLockFunds() public {
        // Platform provider creates a transaction
        vm.prank(platformProvider);
        regrant.createTransaction(renter, borrower, 1 ether, 0.5 ether);

        // Borrower locks funds
        vm.prank(borrower);
        vm.deal(borrower, 1.5 ether); // Fund the borrower with 1.5 ETH
        regrant.lockFunds{value: 1.5 ether}(1);

        // Check contract balance
        assertEq(address(regrant).balance, 1.5 ether);
    }

    function testReleaseFunds() public {
        // Platform provider creates a transaction
        vm.prank(platformProvider);
        regrant.createTransaction(renter, borrower, 1 ether, 0.5 ether);

        // Borrower locks funds
        vm.prank(borrower);
        vm.deal(borrower, 1.5 ether); // Fund the borrower with 1.5 ETH
        regrant.lockFunds{value: 1.5 ether}(1);

        // Renter releases funds
        vm.prank(renter);
        regrant.releaseFunds(1);

        // Check contract balance
        assertEq(address(regrant).balance, 0);

        // Check platform provider fee (2% of 0.5 ETH = 0.01 ETH)
        assertEq(address(platformProvider).balance, 0.01 ether);

        // Check renter fee (98% of 0.5 ETH = 0.49 ETH)
        assertEq(address(renter).balance, 0.49 ether);

        // Check borrower deposit refund (1 ETH)
        assertEq(address(borrower).balance, 1 ether);
    }

    function testDisputeResolution() public {
        // Platform provider creates a transaction
        vm.prank(platformProvider);
        regrant.createTransaction(renter, borrower, 1 ether, 0.5 ether);

        // Borrower locks funds
        vm.prank(borrower);
        vm.deal(borrower, 1.5 ether); // Fund the borrower with 1.5 ETH
        regrant.lockFunds{value: 1.5 ether}(1);

        // Renter initiates a dispute
        vm.prank(renter);
        regrant.initiateDispute(1);

        // Platform provider resolves the dispute (refund borrower)
        vm.prank(platformProvider);
        regrant.resolveDispute(1, true);

        // Check borrower balance (deposit + rental fee)
        assertEq(address(borrower).balance, 1.5 ether);
    }
}