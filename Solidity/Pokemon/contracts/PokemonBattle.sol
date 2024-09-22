// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PokemonBattle is ERC721, ERC721URIStorage, ERC721Burnable, ERC721Pausable, Ownable {
    enum Attribute { HP, Attack, Defense, Speed, SpecialAtack, SpecialDefense }
    enum Element { Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy }

    struct Pokemon { uint256 id; string name; uint256 hp; uint256 attack; uint256 defense; uint256 speed; uint256 specialAtack; uint256 specialDefense; Element element; string uri; uint256 level; uint256 experience; }
    struct Evolution { string name; string uri; uint256 level; }

    event Result(uint256 indexed winner, uint256 indexed loser, Attribute attribute);
    event Evolved(uint256 indexed id);

    mapping(uint256 => Pokemon) public pokemons;
    mapping(uint256 => Evolution[]) pokemonsEvolutions;
    mapping(address => uint256[]) private ownersPokemons;

    uint256 private constant ATTRIBUTES = 6;
    uint256 private constant EXPERIENCE_INCREMENT = 50;
    uint256 private constant EXPERIENCE_TO_NEXT_LEVEL = 100;
    uint256 private currentId;

    constructor(address owner) ERC721("Pokemon", "PKM") Ownable(owner) {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function mint(address to, Pokemon memory pokemon, Evolution[] memory evolutions) external onlyOwner {
        pokemon.id = ++currentId;
        _safeMint(to, pokemon.id);
        _setTokenURI(pokemon.id, pokemon.uri);
        pokemons[pokemon.id] = pokemon;
        ownersPokemons[to].push(pokemon.id);
        for (uint256 i = 0; i < evolutions.length; i++) { pokemonsEvolutions[pokemon.id].push(evolutions[i]); }
    }

    function battle(uint256 id1, uint256 id2) external {
        require(ownerOf(id1) == msg.sender || ownerOf(id2) == msg.sender, "You must own at least one of the Pokemon to initiate a battle!");
        (Pokemon storage winner, Pokemon storage loser, Attribute attribute) = compute(id1, id2);
        increase(winner);
        emit Result(winner.id, loser.id, attribute);
    }

    function compute(uint256 id1, uint256 id2) internal view returns (Pokemon storage winner, Pokemon storage loser, Attribute attribute) {
        attribute = getRandomAttribute();
        Pokemon storage pokemon1 = pokemons[id1];
        Pokemon storage pokemon2 = pokemons[id2];
        uint256 pokemon1Attribute = getAttributeValue(pokemon1, attribute);
        uint256 pokemon2Attribute = getAttributeValue(pokemon2, attribute);
        return pokemon1Attribute >= pokemon2Attribute ? (pokemon1, pokemon2, attribute) : (pokemon2, pokemon1, attribute);
    }

    function increase(Pokemon storage pokemon) internal {
        Attribute attribute = getRandomAttribute();

        if (attribute == Attribute.HP) pokemon.hp += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.Attack) pokemon.attack += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.Defense) pokemon.defense += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.Speed) pokemon.speed += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.SpecialAtack) pokemon.specialAtack += EXPERIENCE_INCREMENT;
        else if (attribute == Attribute.SpecialDefense) pokemon.specialDefense += EXPERIENCE_INCREMENT;

        pokemon.experience += EXPERIENCE_INCREMENT;

        if (pokemon.experience >= EXPERIENCE_TO_NEXT_LEVEL) {
            pokemon.level++;
            pokemon.experience = 0;
            evolve(pokemon);
        }
    }

    function evolve(Pokemon storage pokemon) internal {
        Evolution[] storage evolutions = pokemonsEvolutions[pokemon.id];
        uint256 length = evolutions.length;

        for (uint256 i = 0; i < length; i++) {
            Evolution memory evolution = evolutions[i];

            if (pokemon.level >= evolution.level) {
                pokemon.name = evolution.name;
                pokemon.uri = evolution.uri;
                _setTokenURI(pokemon.id, pokemon.uri);
                evolutions[i] = evolutions[length - 1];
                evolutions.pop();
                emit Evolved(pokemon.id);
                break;
            }
        }
    }

    function listPokemons() public view returns (Pokemon[] memory) {
        uint256[] storage ids = ownersPokemons[msg.sender];
        Pokemon[] memory list = new Pokemon[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) { list[i] = getPokemon(ids[i]); }
        return list;
    }

    function getPokemon(uint256 id) public view returns (Pokemon memory) {
        require(ownerOf(id) == msg.sender, "You must own the Pokemon!");
        return pokemons[id];
    }

    function removeOwner(address owner, uint256 id) internal {
        uint256[] storage ids = ownersPokemons[owner];
        uint256 length = ids.length;

        for (uint256 i = 0; i < length; i++) {
            if (ids[i] == id) {
                ids[i] = ids[length - 1];
                ids.pop();
                break;
            }
        }
    }

    function getAttributeValue(Pokemon memory pokemon, Attribute attribute) internal pure returns (uint256) {
        return [pokemon.hp, pokemon.attack, pokemon.defense, pokemon.speed, pokemon.specialAtack, pokemon.specialDefense][uint256(attribute)];
    }

    function getRandomAttribute() internal view returns (Attribute) {
        return Attribute(uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % ATTRIBUTES);
    }

    function transferFrom(address from, address to, uint256 id) public override(IERC721, ERC721) {
        super.transferFrom(from, to, id);
        removeOwner(from, id);
        ownersPokemons[to].push(id);
    }

    function _update(address to, uint256 id, address auth) internal override(ERC721, ERC721Pausable) returns (address) {
        return super._update(to, id, auth);
    }

    function tokenURI(uint256 id) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(id);
    }

    function supportsInterface(bytes4 id) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(id);
    }
}
