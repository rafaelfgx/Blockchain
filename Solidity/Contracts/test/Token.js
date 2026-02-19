import hardhat from "hardhat";
import { expect } from "chai";

const { ethers } = await hardhat.network.connect();

const fixture = async () => {
    const [owner, signer1, signer2] = await ethers.getSigners();
    const contract = await ethers.deployContract("Token", [owner.address]);
    return { ethers, contract, owner, signer1, signer2 };
}

describe("Token", () => {
    it("verifies name and symbol", async () => {
        const { contract } = await fixture();
        expect(await contract.name()).to.equal("Token");
        expect(await contract.symbol()).to.equal("TKN");
    });

    it("verifies contract owner", async () => {
        const { contract, owner } = await fixture();
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("assigns total supply to owner", async () => {
        const { contract, owner } = await fixture();
        expect(await contract.totalSupply()).to.equal(await contract.balanceOf(owner.address));
    });

    it("handles transfers between accounts", async () => {
        const { contract, signer1, signer2 } = await fixture();

        await contract.transfer(signer1.address, 50);
        expect(await contract.balanceOf(signer1.address)).to.equal(50);

        await contract.connect(signer1).transfer(signer2.address, 10);
        expect(await contract.balanceOf(signer2.address)).to.equal(10);
    });

    it("reverts transfer exceeding balance", async () => {
        const { ethers, contract, signer1, signer2 } = await fixture();
        await expect(contract.connect(signer1).transfer(signer2.address, 1)).to.revert(ethers);
    });

    it("allows owner to burn tokens", async () => {
        const { contract, owner } = await fixture();
        const initialSupply = await contract.totalSupply();
        await contract.burn(100);
        const newSupply = await contract.totalSupply();
        expect(newSupply).to.equal(initialSupply - BigInt(100));
        expect(await contract.balanceOf(owner.address)).to.equal(newSupply);
    });

    it("reverts burn exceeding balance", async () => {
        const { ethers, contract, signer1 } = await fixture();
        await expect(contract.connect(signer1).burn(1)).to.revert(ethers);
    });

    it("allows owner to pause and prevents transfers", async () => {
        const { ethers, contract, signer1 } = await fixture();
        await contract.pause();
        expect(await contract.paused()).to.equal(true);
        await expect(contract.transfer(signer1.address, 50)).to.revert(ethers);
    });

    it("allows owner to unpause and enables transfers", async () => {
        const { contract, signer1 } = await fixture();
        await contract.pause();
        await contract.unpause();
        expect(await contract.paused()).to.equal(false);
        await contract.transfer(signer1.address, 50);
        expect(await contract.balanceOf(signer1.address)).to.equal(50);
    });

    it("reverts pause/unpause from non-owner", async () => {
        const { ethers, contract, signer1 } = await fixture();
        await expect(contract.connect(signer1).pause()).to.revert(ethers);
        await contract.pause();
        await expect(contract.connect(signer1).unpause()).to.revert(ethers);
    });
});
