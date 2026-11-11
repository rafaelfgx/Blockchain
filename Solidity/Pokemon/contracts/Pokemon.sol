// SPDX-License-Identifier: MIT

pragma solidity 0.8.34;

import {Element} from "./Element.sol";
import {Evolution} from "./Evolution.sol";

struct Pokemon {
    uint id;
    string name;
    Element element;
    uint8 level;
    uint hp;
    uint attack;
    uint defense;
    uint speed;
    uint specialAttack;
    uint specialDefense;
    uint xp;
    Evolution[] evolutions;
}
