const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", () => {
    let contract, owner, signer1, signer2;

    beforeEach(async () => {
        [owner, signer1, signer2] = await ethers.getSigners();
        contract = await (await ethers.getContractFactory("Token")).deploy(owner.address);
    });

    it("verifies name and symbol", async () => {
        expect(await contract.name()).to.equal("Token");
        expect(await contract.symbol()).to.equal("TKN");
    });

    it("verifies contract owner", async () => {
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("assigns total supply to owner", async () => {
        expect(await contract.totalSupply()).to.equal(await contract.balanceOf(owner.address));
    });

    it("handles transfers between accounts", async () => {
        await contract.transfer(signer1.address, 50);
        expect(await contract.balanceOf(signer1.address)).to.equal(50);

        await contract.connect(signer1).transfer(signer2.address, 10);
        expect(await contract.balanceOf(signer2.address)).to.equal(10);
    });

    it("reverts transfer exceeding balance", async () => {
        await expect(contract.connect(signer1).transfer(signer2.address, 1)).to.be.reverted;
    });

    it("allows owner to burn tokens", async () => {
        const initialSupply = await contract.totalSupply();
        await contract.burn(100);
        expect(await contract.totalSupply()).to.equal(initialSupply - BigInt(100));
        expect(await contract.balanceOf(owner.address)).to.equal(initialSupply - BigInt(100));
    });

    it("reverts burn exceeding balance", async () => {
        await expect(contract.connect(signer1).burn(1)).to.be.reverted;
    });

    it("allows owner to pause and prevents transfers", async () => {
        await contract.pause();
        expect(await contract.paused()).to.equal(true);
        await expect(contract.transfer(signer1.address, 50)).to.be.reverted;
    });

    it("allows owner to unpause and enables transfers", async () => {
        await contract.pause();
        await contract.unpause();
        expect(await contract.paused()).to.equal(false);
        await contract.transfer(signer1.address, 50);
        expect(await contract.balanceOf(signer1.address)).to.equal(50);
    });

    it("reverts pause/unpause from non-owner", async () => {
        await expect(contract.connect(signer1).pause()).to.be.reverted;
        await contract.pause();
        await expect(contract.connect(signer1).unpause()).to.be.reverted;
    });
});
