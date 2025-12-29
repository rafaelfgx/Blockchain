// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import "./Element.sol";

struct Pokemon {
    uint256 id;
    string name;
    uint256 hp;
    uint256 attack;
    uint256 defense;
    uint256 speed;
    uint256 specialAtack;
    uint256 specialDefense;
    Element element;
    uint8 level;
    uint256 experience;
}
