// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Attribute.sol";
import "./Constants.sol";
import "./Element.sol";
import "./Evolution.sol";
import "./Evolved.sol";
import "./Pokemon.sol";
import "./Result.sol";

contract Game is ERC721Burnable, ERC721Enumerable, ERC721Pausable, ERC721URIStorage, Ownable {
    uint private currentId;
    mapping(uint => Pokemon) private pokemons;

    constructor(address owner) ERC721("Pokemon", "PKM") Ownable(owner) {}

    function mint(address to, Pokemon calldata pokemon) external onlyOwner {
        uint id = ++currentId;
        _safeMint(to, id);
        _setTokenURI(id, pokemon.name);
        pokemons[id] = pokemon;
        pokemons[id].id = id;
    }

    function listPokemons() external view returns (Pokemon[] memory senderPokemons) {
        uint balance = balanceOf(msg.sender);
        senderPokemons = new Pokemon[](balance);
        for (uint i = 0; i < balance; i++) {
            senderPokemons[i] = pokemons[tokenOfOwnerByIndex(msg.sender, i)];
        }
    }

    function getPokemon(uint id) external view returns (Pokemon memory) {
        require(ownerOf(id) == msg.sender, "You must own the Pokemon!");
        return pokemons[id];
    }

    function battle(uint id1, uint id2) external {
        require(ownerOf(id1) == msg.sender || ownerOf(id2) == msg.sender, "You must own at least one of the Pokemons!");
        (Pokemon storage winner, Pokemon storage loser, Attribute attribute) = _compute(id1, id2);
        _increase(winner);
        emit Result(winner.id, loser.id, attribute);
    }

    function _compute(uint id1, uint id2) internal view returns (Pokemon storage winner, Pokemon storage loser, Attribute attribute) {
        attribute = _getAttribute();
        Pokemon storage pokemon1 = pokemons[id1];
        Pokemon storage pokemon2 = pokemons[id2];
        return _getAttributeValue(pokemon1, attribute) >= _getAttributeValue(pokemon2, attribute)
            ? (pokemon1, pokemon2, attribute)
            : (pokemon2, pokemon1, attribute);
    }

    function _increase(Pokemon storage pokemon) internal {
        pokemon.xp += XP;
        _increaseAttribute(pokemon);
        _levelUp(pokemon);
        _evolve(pokemon);
    }

    function _levelUp(Pokemon storage pokemon) internal {
        if (pokemon.xp < XP_LEVEL_UP) return;
        pokemon.level++;
        pokemon.xp = 0;
    }

    function _evolve(Pokemon storage pokemon) internal {
        Evolution[] storage evolutions = pokemon.evolutions;
        if (evolutions.length == 0 || pokemon.level < evolutions[0].level) return;
        pokemon.name = evolutions[0].name;
        _setTokenURI(pokemon.id, pokemon.name);
        evolutions[0] = evolutions[evolutions.length - 1];
        evolutions.pop();
        emit Evolved(pokemon.id);
    }

    function _getAttribute() internal view returns (Attribute) {
        return Attribute(uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % ATTRIBUTE_LENGTH);
    }

    function _getAttributeValue(Pokemon memory pokemon, Attribute attribute) internal pure returns (uint) {
        if (attribute == Attribute.HP) return pokemon.hp;
        if (attribute == Attribute.Attack) return pokemon.attack;
        if (attribute == Attribute.Defense) return pokemon.defense;
        if (attribute == Attribute.Speed) return pokemon.speed;
        if (attribute == Attribute.SpecialAttack) return pokemon.specialAttack;
        if (attribute == Attribute.SpecialDefense) return pokemon.specialDefense;
        return 0;
    }

    function _increaseAttribute(Pokemon storage pokemon) internal {
        Attribute attribute = _getAttribute();
        if (attribute == Attribute.HP) pokemon.hp += XP;
        else if (attribute == Attribute.Attack) pokemon.attack += XP;
        else if (attribute == Attribute.Defense) pokemon.defense += XP;
        else if (attribute == Attribute.Speed) pokemon.speed += XP;
        else if (attribute == Attribute.SpecialAttack) pokemon.specialAttack += XP;
        else if (attribute == Attribute.SpecialDefense) pokemon.specialDefense += XP;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function supportsInterface(bytes4 id) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(id);
    }

    function tokenURI(uint id) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(id);
    }

    function _baseURI() internal pure override returns (string memory) {
        return BASE_URI;
    }

    function _update(address to, uint id, address auth) internal override(ERC721, ERC721Enumerable, ERC721Pausable) returns (address) {
        return super._update(to, id, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
}
