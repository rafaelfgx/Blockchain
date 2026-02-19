import hardhat from "hardhat";
import { expect } from "chai";

const { ethers } = await hardhat.network.connect();

const fixture = async () => {
    const [owner, signer] = await ethers.getSigners();
    const contract = await ethers.deployContract("SBT", [owner.address]);
    return { ethers, contract, owner, signer };
}

describe("SBT", () => {
    it("verifies name and symbol", async () => {
        const { contract } = await fixture();
        expect(await contract.name()).to.equal("SBT");
        expect(await contract.symbol()).to.equal("SBT");
    });

    it("verifies contract owner", async () => {
        const { contract, owner } = await fixture();
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("mints an SBT", async () => {
        const { contract, owner } = await fixture();
        await contract.mint(owner.address, "uri");
        expect(await contract.ownerOf(1)).to.equal(owner.address);
    });

    it("checks token URI after minting", async () => {
        const { contract, owner } = await fixture();
        await contract.mint(owner.address, "uri");
        expect(await contract.tokenURI(1)).to.equal("https://ipfs.io/ipfs/uri");
    });

    it("blocks transfers", async () => {
        const { ethers, contract, owner, signer } = await fixture();
        await contract.mint(owner.address, "uri");
        await expect(contract.transferFrom(owner.address, signer.address, 1)).to.revert(ethers);
    });

    it("burns an SBT", async () => {
        const { ethers, contract, owner } = await fixture();
        await contract.mint(owner.address, "uri");
        await contract.burn(1);
        await expect(contract.ownerOf(1)).to.revert(ethers);
    });

    it("reverts burning nonexistent identifier", async () => {
        const { ethers, contract } = await fixture();
        await expect(contract.burn(999)).to.revert(ethers);
    });

    it("handles pause and unpause", async () => {
        const { contract } = await fixture();
        await contract.pause();
        expect(await contract.paused()).to.be.true;
        await contract.unpause();
        expect(await contract.paused()).to.be.false;
    });

    it("reverts minting when paused", async () => {
        const { ethers, contract, owner } = await fixture();
        await contract.pause();
        await expect(contract.mint(owner.address, "uri")).to.revert(ethers);
        await contract.unpause();
    });

    it("reverts pause/unpause from non-owner", async () => {
        const { ethers, contract, signer } = await fixture();
        await expect(contract.connect(signer).pause()).to.revert(ethers);
        await contract.pause();
        await expect(contract.connect(signer).unpause()).to.revert(ethers);
    });
});
