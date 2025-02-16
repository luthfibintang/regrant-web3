// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Regrant is ReentrancyGuard {
    // Struct to store transaction details
    struct Transaction {
        address renter;
        address borrower;
        uint256 depositAmount;
        uint256 rentalFee;
        bool isCompleted;
        bool isDisputed;
    }

    // Platform provider address (Regrant)
    address public immutable platformProvider;

    // Mapping to store transactions by transaction ID
    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCounter;

    // Events
    event TransactionCreated(uint256 transactionId, address renter, address borrower, uint256 depositAmount, uint256 rentalFee);
    event FundsLocked(uint256 transactionId);
    event FundsReleased(uint256 transactionId);
    event DisputeInitiated(uint256 transactionId);
    event DisputeResolved(uint256 transactionId, bool refundBorrower);

    // Constructor to set the platform provider address
    constructor() {
        platformProvider = msg.sender; // Regrant is the platform provider
    }

    // Modifier to check if the caller is the platform provider
    modifier onlyPlatformProvider() {
        require(msg.sender == platformProvider, "Caller is not the platform provider");
        _;
    }

    // Modifier to check if the caller is the renter
    modifier onlyRenter(uint256 transactionId) {
        require(transactions[transactionId].renter == msg.sender, "Caller is not the renter");
        _;
    }

    // Modifier to check if the caller is the borrower
    modifier onlyBorrower(uint256 transactionId) {
        require(transactions[transactionId].borrower == msg.sender, "Caller is not the borrower");
        _;
    }

    // Modifier to check if the transaction is active
    modifier onlyActiveTransaction(uint256 transactionId) {
        require(!transactions[transactionId].isCompleted, "Transaction is already completed");
        _;
    }

    // Function for platform provider to create a new transaction
    function createTransaction(address renter, address borrower, uint256 depositAmount, uint256 rentalFee) external {
        transactionCounter++;
        transactions[transactionCounter] = Transaction({
            renter: renter,
            borrower: borrower,
            depositAmount: depositAmount,
            rentalFee: rentalFee,
            isCompleted: false,
            isDisputed: false
        });

        emit TransactionCreated(transactionCounter, renter, borrower, depositAmount, rentalFee);
    }

    // Function for borrower to lock funds (deposit + rental fee)
    function lockFunds(uint256 transactionId) external payable onlyBorrower(transactionId) onlyActiveTransaction(transactionId) {
        Transaction storage transaction = transactions[transactionId];
        require(msg.value == transaction.depositAmount + transaction.rentalFee, "Incorrect amount sent");

        emit FundsLocked(transactionId);
    }

    // Function for renter to release funds after successful rental
    function releaseFunds(uint256 transactionId) external onlyRenter(transactionId) onlyActiveTransaction(transactionId) nonReentrant {
        Transaction storage transaction = transactions[transactionId];
        require(!transaction.isDisputed, "Transaction is under dispute");
        require(address(this).balance >= transaction.depositAmount + transaction.rentalFee, "Insufficient contract balance");

        // Calculate platform fee (2% of rental fee)
        uint256 platformFee = (transaction.rentalFee * 2) / 100;
        uint256 renterFee = transaction.rentalFee - platformFee;

        // Transfer platform fee to platform provider
        (bool success1, ) = payable(platformProvider).call{value: platformFee}("");
        // Transfer renter fee to renter
        (bool success2, ) = payable(transaction.renter).call{value: renterFee}("");
        // Refund deposit to borrower
        (bool success3, ) = payable(transaction.borrower).call{value: transaction.depositAmount}("");
        require(success1 && success2 && success3, "Transfer failed");

        transaction.isCompleted = true;

        emit FundsReleased(transactionId);
    }

    // Still not functioning or rather idk to implement this
    // Function for renter to initiate a dispute
    function initiateDispute(uint256 transactionId) external onlyRenter(transactionId) onlyActiveTransaction(transactionId) {
        Transaction storage transaction = transactions[transactionId];
        transaction.isDisputed = true;

        emit DisputeInitiated(transactionId);
    }

    // Function for platform provider to resolve a dispute
    function resolveDispute(uint256 transactionId, bool refundBorrower) external onlyPlatformProvider onlyActiveTransaction(transactionId) nonReentrant {
        Transaction storage transaction = transactions[transactionId];
        require(transaction.isDisputed, "No dispute to resolve");

        if (refundBorrower) {
            payable(transaction.borrower).transfer(transaction.depositAmount + transaction.rentalFee);
        } else {
            payable(transaction.renter).transfer(transaction.depositAmount + transaction.rentalFee);
        }

        transaction.isCompleted = true;
        emit DisputeResolved(transactionId, refundBorrower);
    }
}