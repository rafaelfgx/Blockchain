// SPDX-License-Identifier: MIT

pragma solidity 0.8.34;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721Pausable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Attribute} from "./Attribute.sol";
import {AttributeLibrary} from "./AttributeLibrary.sol";
import {Pokemon} from "./Pokemon.sol";
import {PokemonLibrary} from "./PokemonLibrary.sol";
import {Result} from "./Result.sol";

using PokemonLibrary for Pokemon;

contract Game is ERC721Burnable, ERC721Enumerable, ERC721Pausable, ERC721URIStorage, Ownable {
    error NotPokemonOwner();

    error NotBattleParticipant();

    string private constant BASE_URI = "https://ipfs.io/ipfs/";

    uint private currentId;

    mapping(uint id => Pokemon pokemon) private pokemons;

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
        for (uint i; i < balance; ++i) {
            senderPokemons[i] = pokemons[tokenOfOwnerByIndex(msg.sender, i)];
        }
    }

    function getPokemon(uint id) external view returns (Pokemon memory) {
        require(ownerOf(id) == msg.sender, NotPokemonOwner());
        return pokemons[id];
    }

    function battle(uint id1, uint id2) external {
        require(ownerOf(id1) == msg.sender || ownerOf(id2) == msg.sender, NotBattleParticipant());
        (Pokemon storage winner, Pokemon storage loser, Attribute attribute) = _compute(id1, id2);
        winner.increase();
        _setTokenURI(winner.id, winner.name);
        emit Result(winner.id, loser.id, attribute);
    }

    function _compute(uint id1, uint id2) internal view returns (Pokemon storage winner, Pokemon storage loser, Attribute attribute) {
        attribute = AttributeLibrary.random();
        Pokemon storage pokemon1 = pokemons[id1];
        Pokemon storage pokemon2 = pokemons[id2];
        (winner, loser) = pokemon1.getAttribute(attribute) >= pokemon2.getAttribute(attribute) ? (pokemon1, pokemon2) : (pokemon2, pokemon1);
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
