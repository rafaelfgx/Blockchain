// SPDX-License-Identifier: MIT

pragma solidity 0.8.34;

import "./Attribute.sol";

library AttributeLibrary {
    function length() internal pure returns (uint8) {
        return uint8(type(Attribute).max) + 1;
    }

    function random() internal view returns (Attribute) {
        return Attribute(uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % length());
    }
}
