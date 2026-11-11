// SPDX-License-Identifier: MIT

pragma solidity 0.8.34;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Pausable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721Burnable, ERC721Pausable, ERC721URIStorage, Ownable {
    error Unauthorized();

    string private constant BASE_URI = "https://ipfs.io/ipfs/";

    uint256 private currentId;

    constructor(address owner) Ownable(owner) ERC721("NFT", "NFT") {}

    function _baseURI() internal pure override returns (string memory) {
        return BASE_URI;
    }

    function mint(address to, string memory uri) public onlyOwner {
        uint256 id = ++currentId;
        _safeMint(to, id);
        _setTokenURI(id, uri);
    }

    function burn(uint256 id) public override {
        require(msg.sender == owner() || msg.sender == ownerOf(id), Unauthorized());
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
