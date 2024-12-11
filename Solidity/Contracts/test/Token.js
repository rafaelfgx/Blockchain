const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
    let contract, owner, signer1, signer2;

    beforeEach(async function () {
        const factory = await ethers.getContractFactory("Token");
        [owner, signer1, signer2] = await ethers.getSigners();
        contract = await factory.deploy(owner.address);
    });

    it("Should have correct name and symbol", async function () {
        expect(await contract.name()).to.equal("Token");
        expect(await contract.symbol()).to.equal("TKN");
    });

    it("Should assign total supply to the owner", async function () {
        expect(await contract.totalSupply()).to.equal(await contract.balanceOf(owner.address));
    });

    it("Should allow transfers between accounts", async function () {
        await contract.transfer(signer1.address, 50);
        expect(await contract.balanceOf(signer1.address)).to.equal(50);

        await contract.connect(signer1).transfer(signer2.address, 10);
        expect(await contract.balanceOf(signer2.address)).to.equal(10);
    });

    it("Should revert if transfer exceeds balance", async function () {
        await expect(contract.connect(signer1).transfer(signer2.address, 1)).to.be.reverted;
    });
});
