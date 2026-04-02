// SPDX-License-Identifier: MIT

pragma solidity 0.8.34;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Attribute.sol";
import "./AttributeLibrary.sol";
import "./Pokemon.sol";
import "./PokemonLibrary.sol";
import "./Result.sol";

using PokemonLibrary for Pokemon;

contract Game is ERC721Burnable, ERC721Enumerable, ERC721Pausable, ERC721URIStorage, Ownable {
    string constant BASE_URI = "https://ipfs.io/ipfs/";
    uint private currentId;
    mapping(uint => Pokemon) private pokemons;

    constructor(address owner) ERC721("Pokemon", "PKM") Ownable(owner) {}

    function mint(address to, Pokemon calldata pokemon) external onlyOwner {
        _safeMint(to, ++currentId);
        _setTokenURI(currentId, pokemon.name);
        pokemons[currentId] = pokemon;
        pokemons[currentId].id = currentId;
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
        winner.increase();
        _setTokenURI(winner.id, winner.name);
        emit Result(winner.id, loser.id, attribute);
    }

    function _compute(uint id1, uint id2) internal view returns (Pokemon storage winner, Pokemon storage loser, Attribute attribute) {
        attribute = AttributeLibrary.random();
        Pokemon storage pokemon1 = pokemons[id1];
        Pokemon storage pokemon2 = pokemons[id2];
        return pokemon1.getAttribute(attribute) >= pokemon2.getAttribute(attribute) ? (pokemon1, pokemon2, attribute) : (pokemon2, pokemon1, attribute);
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
