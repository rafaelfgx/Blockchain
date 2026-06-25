// SPDX-License-Identifier: MIT

pragma solidity 0.8.34;

import "./Attribute.sol";
import "./AttributeLibrary.sol";
import "./Evolution.sol";
import "./Evolved.sol";
import "./Pokemon.sol";

library PokemonLibrary {
    uint8 constant XP = 50;
    uint8 constant XP_LEVEL = 100;

    function getAttribute(Pokemon memory pokemon, Attribute attribute) internal pure returns (uint) {
        if (attribute == Attribute.HP) return pokemon.hp;
        if (attribute == Attribute.Attack) return pokemon.attack;
        if (attribute == Attribute.Defense) return pokemon.defense;
        if (attribute == Attribute.Speed) return pokemon.speed;
        if (attribute == Attribute.SpecialAttack) return pokemon.specialAttack;
        if (attribute == Attribute.SpecialDefense) return pokemon.specialDefense;
        revert("InvalidAttribute");
    }

    function increaseAttribute(Pokemon storage pokemon, Attribute attribute, uint value) internal {
        if (attribute == Attribute.HP) pokemon.hp += value;
        else if (attribute == Attribute.Attack) pokemon.attack += value;
        else if (attribute == Attribute.Defense) pokemon.defense += value;
        else if (attribute == Attribute.Speed) pokemon.speed += value;
        else if (attribute == Attribute.SpecialAttack) pokemon.specialAttack += value;
        else if (attribute == Attribute.SpecialDefense) pokemon.specialDefense += value;
        else revert("InvalidAttribute");
    }

    function increaseExperience(Pokemon storage pokemon) internal {
        pokemon.xp += XP;
    }

    function increaseLevel(Pokemon storage pokemon) internal {
        if (pokemon.xp < XP_LEVEL) return;
        pokemon.level++;
        pokemon.xp = 0;
    }

    function evolve(Pokemon storage pokemon) internal {
        Evolution[] storage evolutions = pokemon.evolutions;
        if (evolutions.length == 0 || pokemon.level < evolutions[0].level) return;
        pokemon.name = evolutions[0].name;
        evolutions[0] = evolutions[evolutions.length - 1];
        evolutions.pop();
        emit Evolved(pokemon.id);
    }

    function increase(Pokemon storage pokemon) internal {
        increaseAttribute(pokemon, AttributeLibrary.random(), XP);
        increaseExperience(pokemon);
        increaseLevel(pokemon);
        evolve(pokemon);
    }
}
