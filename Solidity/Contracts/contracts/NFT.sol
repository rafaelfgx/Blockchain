// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, ERC721URIStorage, ERC721Burnable, ERC721Pausable, Ownable {
    uint256 private currentId;

    constructor(address owner) Ownable(owner) ERC721("NFT", "NFT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function mint(address to, string memory uri) public onlyOwner {
        currentId++;
        _safeMint(to, currentId);
        _setTokenURI(currentId, uri);
    }

    function burn(uint256 id) public override whenNotPaused {
        require(msg.sender == owner() || msg.sender == ownerOf(id));
        _burn(id);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
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
