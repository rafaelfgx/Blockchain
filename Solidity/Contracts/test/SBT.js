const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SBT", () => {
    let contract, owner, signer;

    beforeEach(async () => {
        [owner, signer] = await ethers.getSigners();
        contract = await (await ethers.getContractFactory("SBT")).deploy(owner.address);
    });

    it("verifies name and symbol", async () => {
        expect(await contract.name()).to.equal("SBT");
        expect(await contract.symbol()).to.equal("SBT");
    });

    it("verifies contract owner", async () => {
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("mints an SBT", async () => {
        await contract.mint(owner.address, "uri");
        expect(await contract.ownerOf(1)).to.equal(owner.address);
    });

    it("checks token URI after minting", async () => {
        await contract.mint(owner.address, "uri");
        expect(await contract.tokenURI(1)).to.equal("https://ipfs.io/ipfs/uri");
    });

    it("blocks transfers", async () => {
        await contract.mint(owner.address, "uri");
        await expect(contract.transferFrom(owner.address, signer.address, 1)).to.be.reverted;
    });

    it("burns an SBT", async () => {
        await contract.mint(owner.address, "uri");
        await contract.burn(1);
        await expect(contract.ownerOf(1)).to.be.reverted;
    });

    it("reverts burning nonexistent identifier", async () => {
        await expect(contract.burn(999)).to.be.reverted;
    });

    it("handles pause and unpause", async () => {
        await contract.pause();
        expect(await contract.paused()).to.be.true;
        await contract.unpause();
        expect(await contract.paused()).to.be.false;
    });

    it("reverts minting when paused", async () => {
        await contract.pause();
        await expect(contract.mint(owner.address, "uri")).to.be.reverted;
        await contract.unpause();
    });

    it("reverts pause/unpause from non-owner", async () => {
        await expect(contract.connect(signer).pause()).to.be.reverted;
        await contract.pause();
        await expect(contract.connect(signer).unpause()).to.be.reverted;
    });
});
