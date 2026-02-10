// SPDX-License-Identifier: MIT

pragma solidity 0.8.33;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SBT is ERC721, ERC721Burnable, ERC721Pausable, ERC721URIStorage, Ownable {
    uint256 private _currentId;

    constructor(address owner) Ownable(owner) ERC721("SBT", "SBT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function mint(address to, string memory uri) public onlyOwner {
        _safeMint(to, ++_currentId);
        _setTokenURI(_currentId, uri);
    }

    function burn(uint256 id) public override {
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

    function transferFrom(address, address, uint256) public pure override(IERC721, ERC721) {
        require(false);
    }
}
