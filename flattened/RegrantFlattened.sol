// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ^0.8.20;

// lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol

// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}

// src/Regrant.sol

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

    // Developer wallet address (platform provider)
    address public immutable developerWallet;

    // Mapping to store transactions by transaction ID
    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCounter;

    // Events
    event TransactionCreated(uint256 transactionId, address renter, address borrower, uint256 depositAmount, uint256 rentalFee);
    event FundsLocked(uint256 transactionId);
    event FundsReleased(uint256 transactionId);
    event DisputeInitiated(uint256 transactionId);
    event DisputeResolved(uint256 transactionId, bool refundBorrower);

    // Constructor to set the developer wallet address
    constructor(address _developerWallet) {
        developerWallet = _developerWallet;
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

    // Function for renter to create a new transaction
    function createTransaction(address borrower, uint256 depositAmount, uint256 rentalFee) external {
        transactionCounter++;
        transactions[transactionCounter] = Transaction({
            renter: msg.sender,
            borrower: borrower,
            depositAmount: depositAmount,
            rentalFee: rentalFee,
            isCompleted: false,
            isDisputed: false
        });

        emit TransactionCreated(transactionCounter, msg.sender, borrower, depositAmount, rentalFee);
    }

    // Function for borrower to lock funds (deposit + rental fee)
    function lockFunds(uint256 transactionId) external payable onlyActiveTransaction(transactionId) {
        Transaction storage transaction = transactions[transactionId];
        require(msg.value == transaction.depositAmount + transaction.rentalFee, "Incorrect amount sent");

        emit FundsLocked(transactionId);
    }

    // Function for renter to release funds after successful rental
    function releaseFunds(uint256 transactionId) external onlyActiveTransaction(transactionId) nonReentrant {
        Transaction storage transaction = transactions[transactionId];
        require(!transaction.isDisputed, "Transaction is under dispute");
        require(address(this).balance >= transaction.depositAmount + transaction.rentalFee, "Insufficient contract balance");

        // Calculate developer fee (2% of rental fee)
        uint256 developerFee = (transaction.rentalFee * 2) / 100;
        uint256 renterFee = transaction.rentalFee - developerFee;

        // Transfer developer fee to platform provider
        (bool success1, ) = payable(developerWallet).call{value: developerFee}("");
        // Transfer renter fee to renter
        (bool success2, ) = payable(transaction.renter).call{value: renterFee}("");
        // Refund deposit to borrower
        (bool success3, ) = payable(transaction.borrower).call{value: transaction.depositAmount}("");
        require(success1 && success2 && success3, "Transfer failed");

        transaction.isCompleted = true;

        emit FundsReleased(transactionId);
    }

    // Function for renter to initiate a dispute
    function initiateDispute(uint256 transactionId) external onlyRenter(transactionId) onlyActiveTransaction(transactionId) {
        Transaction storage transaction = transactions[transactionId];
        transaction.isDisputed = true;

        emit DisputeInitiated(transactionId);
    }

    // Function for platform provider to resolve a dispute
    function resolveDispute(uint256 transactionId, bool refundBorrower) external onlyRenter(transactionId) onlyActiveTransaction(transactionId) nonReentrant {
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
