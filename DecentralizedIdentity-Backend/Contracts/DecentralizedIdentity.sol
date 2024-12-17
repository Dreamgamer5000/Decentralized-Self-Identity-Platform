// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedIdentity {
    struct Access {
        address employee;
        uint256 accessTime;
    }

    mapping(address => bytes) public signedMessages; // User's signed messages
    mapping(address => Access[]) public accessControlList; // Access control for employees

    event AccessRequested(address indexed employee, address indexed user);
    event AccessGranted(address indexed user, address indexed employee, uint256 duration);

    // User stores their signed message in the blockchain
    function storeSignedMessage(bytes calldata signedMessage) external {
        signedMessages[msg.sender] = signedMessage;
    }

    // Employee requests access
    function requestAccess(address user) external {
        emit AccessRequested(msg.sender, user);
    }

    // User grants access to an employee for a limited time
    function grantAccess(address employee, uint256 duration) external {
        accessControlList[msg.sender].push(Access(employee, block.timestamp + duration));
        emit AccessGranted(msg.sender, employee, duration);
    }

    // Check if the employee still has access
    function hasAccess(address user, address employee) external view returns (bool) {
        Access[] memory accesses = accessControlList[user];
        for (uint256 i = 0; i < accesses.length; i++) {
            if (accesses[i].employee == employee && block.timestamp <= accesses[i].accessTime) {
                return true;
            }
        }
        return false;
    }
}
