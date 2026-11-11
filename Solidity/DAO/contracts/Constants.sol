// SPDX-License-Identifier: MIT

pragma solidity 0.8.34;

string constant NAME = "DAO";
string constant SYMBOL = "DAO";
uint256 constant INITIAL_SUPPLY = 1_000_000 ether;
uint256 constant PROPOSAL_THRESHOLD = 10_000 ether;
uint32 constant VOTING_DELAY = 1 days;
uint32 constant VOTING_DURATION = 7 days;
uint32 constant QUORUM_PERCENTAGE = 5;
uint32 constant TIMELOCK_DELAY = 2 days;
uint32 constant LATE_QUORUM_EXTENSION = 6 hours;
