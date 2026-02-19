// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

enum Attribute {
    HP,
    Attack,
    Defense,
    Speed,
    SpecialAttack,
    SpecialDefense
}

uint8 constant ATTRIBUTE_LENGTH = uint8(type(Attribute).max) + 1;
