// SPDX-License-Identifier: MIT

pragma solidity 0.8.34;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private value;

    event ValueChanged(uint256 value);

    constructor(address owner) Ownable(owner) {}

    function store(uint256 newValue) external onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

    function retrieve() external view returns (uint256) {
        return value;
    }
}
