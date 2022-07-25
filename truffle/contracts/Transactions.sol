// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transactions {
    uint256 public userCount = 0;
    uint256 public transactionCount = 0;
    bool public locked;

    mapping(uint256 => Person) public userMapping;
    mapping(uint256 => Transaction) public transactionMapping;

    event TransactionCreated(bool completed);

    event UserAdded(bool completed);

    struct Person {
        address id;
        string firstName;
        string lastName;
        uint256 balance;
    }

    struct Transaction {
        uint256 sender;
        uint256 receiver;
        uint256 timestamp;
        uint256 amount;
    }

    constructor() public {}

    function addPerson(string memory _firstName, string memory _lastName)
        public
    {
        if (isUserRegistered(msg.sender)) {
            return;
        }

        registerPerson(msg.sender, _firstName, _lastName);
        emit UserAdded(true);
        return;
    }

    function isUserRegistered(address id) public view returns (bool success) {
        for (uint256 i = 0; i < userCount; i++) {
            if (userMapping[i].id == id) {
                return true;
            }
        }

        return false;
    }

    function registerPerson(
        address id,
        string memory _firstName,
        string memory _lastName
    ) private {
        Person memory newPerson;
        newPerson.id = id;
        newPerson.firstName = _firstName;
        newPerson.lastName = _lastName;
        newPerson.balance = id.balance;
        userMapping[userCount] = newPerson;
        userCount++;
    }

    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }

    function transfer(uint256 _to) public payable noReentrancy {
        uint256 _from;
        for (uint256 i = 0; i < userCount; i++) {
            if (userMapping[i].id == msg.sender) {
                _from = i;
                break;
            }
            if (i == userCount - 1) {
                emit TransactionCreated(false);
                return;
            }
        }
        if (userMapping[_to].balance < msg.value) {
            emit TransactionCreated(false);
            return;
        }

        userMapping[_from].balance -= msg.value;
        userMapping[_to].balance += msg.value;
        Transaction memory newTransaction;
        newTransaction.sender = _from;
        newTransaction.receiver = _to;
        newTransaction.amount = msg.value;
        newTransaction.timestamp = block.timestamp;
        transactionMapping[transactionCount] = newTransaction;
        transactionCount++;

        payable(userMapping[_to].id).transfer(msg.value);

        emit TransactionCreated(true);
    }
}
