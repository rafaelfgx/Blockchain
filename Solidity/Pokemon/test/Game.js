import hardhat from "hardhat";
import { expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";
import pokemons from "./data/Pokemons.js";

const { ethers, networkHelpers } = await hardhat.network.getOrCreate();

const fixture = async () => {
    const [owner, signer1, signer2] = await ethers.getSigners();
    const contract = await ethers.deployContract("Game", [owner.address]);
    return { contract, owner, signer1, signer2 };
};

const verify = async (contract, pokemon, name, level) => {
    expect(pokemon.name).to.equal(name);
    expect(pokemon.level).to.equal(level);
    expect(await contract.tokenURI(pokemon.id)).to.contain(name);
};

describe("Game", () => {
    it("should set the correct owner when deploying the contract", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("should support required interfaces", async () => {
        const { contract } = await networkHelpers.loadFixture(fixture);
        expect(await contract.supportsInterface("0x80ac58cd")).to.be.true;
        expect(await contract.supportsInterface("0x780e9d63")).to.be.true;
        expect(await contract.supportsInterface("0x5b5e139f")).to.be.true;
    });

    it("should revert mint when called by non-owner", async () => {
        const { contract, signer1 } = await networkHelpers.loadFixture(fixture);
        await expect(contract.connect(signer1).mint(signer1.address, pokemons.charmander())).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount").withArgs(signer1.address);
    });

    it("should mint a new pokemon successfully", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
    });

    it("should revert tokenURI when token does not exist", async () => {
        const { contract } = await networkHelpers.loadFixture(fixture);
        await expect(contract.tokenURI(1)).to.be.revertedWithCustomError(contract, "ERC721NonexistentToken").withArgs(1);
    });

    it("should return correct tokenURI after mint", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        expect(await contract.tokenURI(1)).to.contain(`https://ipfs.io/ipfs/${pokemons.charmander().name}`);
    });

    it("should revert pause when called by non-owner", async () => {
        const { contract, signer1 } = await networkHelpers.loadFixture(fixture);
        await expect(contract.connect(signer1).pause()).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount").withArgs(signer1.address);
    });

    it("should revert unpause when called by non-owner", async () => {
        const { contract, signer1 } = await networkHelpers.loadFixture(fixture);
        await contract.pause();
        await expect(contract.connect(signer1).unpause()).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount").withArgs(signer1.address);
    });

    it("should prevent mint when paused and allow after unpause", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        await contract.pause();
        await expect(contract.mint(owner.address, pokemons.charmander())).to.be.revertedWithCustomError(contract, "EnforcedPause");
        await contract.unpause();
        await contract.mint(owner.address, pokemons.charmander());
    });

    it("should revert transfer when contract is paused", async () => {
        const { contract, owner, signer1 } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        await contract.pause();
        await expect(contract.transferFrom(owner.address, signer1.address, 1)).to.be.revertedWithCustomError(contract, "EnforcedPause");
    });

    it("should transfer pokemon successfully between users", async () => {
        const { contract, owner, signer1 } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        await contract.transferFrom(owner.address, signer1.address, 1);
        const listOwner = await contract.listPokemons();
        expect(listOwner.length).to.equal(0);
        const listSigner1 = await contract.connect(signer1).listPokemons();
        expect(listSigner1.length).to.equal(1);
        await verify(contract, listSigner1[0], pokemons.charmander().name, 1);
    });

    it("should revert burn when contract is paused", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        await contract.pause();
        await expect(contract.burn(1)).to.be.revertedWithCustomError(contract, "EnforcedPause");
    });

    it("should burn pokemon successfully", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        await contract.burn(1);
        const list = await contract.listPokemons();
        expect(list.length).to.equal(0);
        await expect(contract.tokenURI(1)).to.be.revertedWithCustomError(contract, "ERC721NonexistentToken").withArgs(1);
    });

    it("should persist pokemon id when minting", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        expect((await contract.getPokemon(1)).id).to.equal(1);
    });

    it("should return empty list when user has no pokemons", async () => {
        const { contract } = await networkHelpers.loadFixture(fixture);
        const list = await contract.listPokemons();
        expect(list.length).to.equal(0);
    });

    it("should list all owned pokemons correctly", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        await contract.mint(owner.address, pokemons.squirtle());
        const list = await contract.listPokemons();
        expect(list.length).to.equal(2);
        await Promise.all([verify(contract, list[0], pokemons.charmander().name, 1), verify(contract, list[1], pokemons.squirtle().name, 1)]);
    });

    it("should revert get pokemon after transfer if caller is not owner", async () => {
        const { contract, owner, signer1 } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        await contract.transferFrom(owner.address, signer1.address, 1);
        await expect(contract.getPokemon(1)).to.be.revertedWith("You must own the Pokemon!");
    });

    it("should revert get pokemon when caller is not owner", async () => {
        const { contract, signer1 } = await networkHelpers.loadFixture(fixture);
        await contract.mint(signer1.address, pokemons.charmander());
        await expect(contract.getPokemon(1)).to.be.revertedWith("You must own the Pokemon!");
    });

    it("should return pokemon data when caller is owner", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        await verify(contract, await contract.connect(owner).getPokemon(1), pokemons.charmander().name, 1);
    });

    it("should revert battle when caller owns none of the pokemons", async () => {
        const { contract, owner, signer1, signer2 } = await networkHelpers.loadFixture(fixture);
        await contract.mint(signer1.address, pokemons.charmander());
        await contract.mint(signer2.address, pokemons.squirtle());
        await expect(contract.connect(owner).battle(1, 2)).to.be.revertedWith("You must own at least one of the Pokemons!");
    });

    it("should revert get pokemon when token does not exist", async () => {
        const { contract } = await networkHelpers.loadFixture(fixture);
        await expect(contract.getPokemon(1)).to.be.revertedWithCustomError(contract, "ERC721NonexistentToken").withArgs(1);
    });

    it("should allow battle event even when paused", async () => {
        const { contract, signer1, signer2 } = await networkHelpers.loadFixture(fixture);
        await contract.mint(signer1.address, pokemons.charmander());
        await contract.mint(signer2.address, pokemons.squirtle());
        await contract.pause();
        await expect(contract.connect(signer1).battle(1, 2)).to.emit(contract, "Result").withArgs(1, 2, anyValue);
    });

    it("should allow battle when both pokemons have same owner", async () => {
        const { contract, owner } = await networkHelpers.loadFixture(fixture);
        await contract.mint(owner.address, pokemons.charmander());
        await contract.mint(owner.address, pokemons.squirtle());
        await expect(contract.battle(1, 2)).to.emit(contract, "Result").withArgs(anyValue, anyValue, anyValue);
    });

    it("should execute battle and evolve pokemon when conditions are met", async () => {
        const { contract, signer1, signer2 } = await networkHelpers.loadFixture(fixture);
        await contract.mint(signer1.address, pokemons.charmander());
        await contract.mint(signer2.address, pokemons.squirtle());
        await expect(contract.connect(signer1).battle(1, 2)).to.emit(contract, "Result").withArgs(1, 2, anyValue);
        await expect(contract.connect(signer2).battle(2, 1)).to.emit(contract, "Result").withArgs(1, 2, anyValue).to.emit(contract, "Evolved").withArgs(1);
        await verify(contract, await contract.connect(signer1).getPokemon(1), pokemons.charmander().evolutions[0].name, 2);
        await verify(contract, await contract.connect(signer2).getPokemon(2), pokemons.squirtle().name, 1);
        expect(await contract.tokenURI(1)).to.contain(pokemons.charmander().evolutions[0].name);
    });
});
