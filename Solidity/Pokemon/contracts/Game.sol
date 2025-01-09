// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
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

contract Game is ERC721, ERC721Burnable, ERC721Pausable, ERC721URIStorage, Ownable {
    uint256 private currentId;
    mapping(uint256 => Pokemon) private pokemons;
    mapping(uint256 => Evolution[]) private pokemonsEvolutions;
    mapping(address => uint256[]) private ownersPokemons;

    constructor(address owner) ERC721("Pokemon", "PKM") Ownable(owner) {}

    function mint(address to, Pokemon memory pokemon, Evolution[] memory evolutions) external onlyOwner {
        pokemon.id = ++currentId;
        _safeMint(to, pokemon.id);
        _setTokenURI(pokemon.id, pokemon.name);
        pokemons[pokemon.id] = pokemon;
        ownersPokemons[to].push(pokemon.id);

        for (uint256 i = 0; i < evolutions.length; i++) {
            pokemonsEvolutions[pokemon.id].push(evolutions[i]);
        }
    }

    function listPokemons() public view returns (Pokemon[] memory) {
        uint256[] storage ids = ownersPokemons[msg.sender];
        Pokemon[] memory list = new Pokemon[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            list[i] = getPokemon(ids[i]);
        }

        return list;
    }

    function getPokemon(uint256 id) public view returns (Pokemon memory) {
        require(ownerOf(id) == msg.sender, "You must own the Pokemon!");
        return pokemons[id];
    }

    function battle(uint256 id1, uint256 id2) external {
        require(ownerOf(id1) == msg.sender || ownerOf(id2) == msg.sender, "You must own at least one of the Pokemons!");
        (Pokemon storage winner, Pokemon storage loser, Attribute attribute) = _compute(id1, id2);
        _increase(winner);
        emit Result(winner.id, loser.id, attribute);
    }

    function _compute(uint256 id1, uint256 id2) internal view returns (Pokemon storage winner, Pokemon storage loser, Attribute attribute) {
        attribute = _getRandomAttribute();
        Pokemon storage pokemon1 = pokemons[id1];
        Pokemon storage pokemon2 = pokemons[id2];
        uint256 pokemon1Attribute = _getAttributeValue(pokemon1, attribute);
        uint256 pokemon2Attribute = _getAttributeValue(pokemon2, attribute);
        return pokemon1Attribute >= pokemon2Attribute ? (pokemon1, pokemon2, attribute) : (pokemon2, pokemon1, attribute);
    }

    function _increase(Pokemon storage pokemon) internal {
        Attribute attribute = _getRandomAttribute();

        if (attribute == Attribute.HP) pokemon.hp += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.Attack) pokemon.attack += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.Defense) pokemon.defense += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.Speed) pokemon.speed += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.SpecialAttack) pokemon.specialAtack += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.SpecialDefense) pokemon.specialDefense += EXPERIENCE_INCREMENT;

        pokemon.experience += EXPERIENCE_INCREMENT;

        _evolve(pokemon);
    }

    function _evolve(Pokemon storage pokemon) internal {
        if (pokemon.experience < EXPERIENCE_TO_NEXT_LEVEL) return;

        pokemon.level++;
        pokemon.experience = 0;

        Evolution[] storage evolutions = pokemonsEvolutions[pokemon.id];

        for (uint256 i = 0; i < evolutions.length; i++) {
            if (pokemon.level >= evolutions[i].level) {
                pokemon.name = evolutions[i].name;
                _setTokenURI(pokemon.id, pokemon.name);
                evolutions[i] = evolutions[evolutions.length - 1];
                evolutions.pop();
                emit Evolved(pokemon.id);
                break;
            }
        }
    }

    function _getAttributeValue(Pokemon memory pokemon, Attribute attribute) internal pure returns (uint256) {
        return [pokemon.hp, pokemon.attack, pokemon.defense, pokemon.speed, pokemon.specialAtack, pokemon.specialDefense][uint256(attribute)];
    }

    function _getRandomAttribute() internal view returns (Attribute) {
        return Attribute(uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % ATTRIBUTE_LENGTH);
    }

    function transferFrom(address from, address to, uint256 id) public override(IERC721, ERC721) {
        _removeOwner(from, id);
        ownersPokemons[to].push(id);
        super.transferFrom(from, to, id);
    }

    function _removeOwner(address owner, uint256 id) internal {
        uint256[] storage ids = ownersPokemons[owner];

        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] == id) {
                ids[i] = ids[ids.length - 1];
                ids.pop();
                break;
            }
        }
    }

    function _update(address to, uint256 id, address auth) internal override(ERC721, ERC721Pausable) returns (address) {
        return super._update(to, id, auth);
    }

    function _baseURI() internal pure override returns (string memory) {
        return BASE_URI;
    }

    function tokenURI(uint256 id) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(id);
    }

    function supportsInterface(bytes4 id) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(id);
    }
}
