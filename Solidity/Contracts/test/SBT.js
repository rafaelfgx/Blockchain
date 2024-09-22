const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SBT", function () {
    let contract, owner, signer;

    beforeEach(async function () {
        const factory = await ethers.getContractFactory("SBT");
        [owner, signer] = await ethers.getSigners();
        contract = await factory.deploy(owner.address);
    });

    it("Should mint an SBT", async function () {
        await contract.mint(owner.address, "uri");
        expect(await contract.ownerOf(1)).to.equal(owner.address);
    });

    it("Should revert minting an SBT when the contract is paused", async function () {
        await contract.pause();
        await expect(contract.mint(owner.address, "uri")).to.be.reverted;
        await contract.unpause();
    });

    it("Should burn an SBT", async function () {
        await contract.mint(owner.address, "uri");
        await contract.burn(1);
        await expect(contract.ownerOf(1)).to.be.reverted;
    });

    it("Should revert burning an SBT when the id does not exist", async function () {
        await expect(contract.burn(999)).to.be.reverted;
    });

    it("Should pause and unpause the contract", async function () {
        await contract.pause();
        expect(await contract.paused()).to.be.true;
        await contract.unpause();
        expect(await contract.paused()).to.be.false;
    });

    it("Should prevent transfers", async function () {
        await contract.mint(owner.address, "uri");
        await expect(contract.transferFrom(owner.address, signer.address, 1)).to.be.reverted;
    });
});
