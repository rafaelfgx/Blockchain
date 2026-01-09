// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

import "./Element.sol";
import "./Evolution.sol";

struct Pokemon {
    uint256 id;
    string name;
    Element element;
    uint8 level;
    uint256 hp;
    uint256 attack;
    uint256 defense;
    uint256 speed;
    uint256 specialAttack;
    uint256 specialDefense;
    uint256 experience;
    Evolution[] evolutions;
}
