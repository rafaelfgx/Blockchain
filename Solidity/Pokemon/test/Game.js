const { ethers } = require("hardhat");
const { expect } = require("chai");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Game", () => {
    const pokemons = {
        charmander: {
            name: "Charmander",
            stats: { hp: 100, attack: 100, defense: 100, speed: 100, specialAtack: 100, specialDefense: 100, element: 1 },
            evolutions: [{ name: "Charmeleon", level: 2 }, { name: "Charizard", level: 3 }]
        },
        squirtle: {
            name: "Squirtle",
            stats: { hp: 50, attack: 50, defense: 50, speed: 50, specialAtack: 50, specialDefense: 50, element: 2 },
            evolutions: [{ name: "Wartortle", level: 2 }, { name: "Blastoise", level: 3 }]
        }
    };

    const fixture = async () => {
        const [owner, signer1, signer2] = await ethers.getSigners();
        const contract = await ethers.getContractFactory("Game").then(f => f.deploy(owner.address));
        return { contract, owner, signer1, signer2 };
    };

    const mint = async (contract, signer, name, stats, evolutions) => contract.mint(signer.address, { id: 0, name, level: 1, experience: 0, ...stats }, evolutions);

    const verify = async (contract, pokemon, name, level) => {
        expect(pokemon.name).to.equal(name);
        expect(pokemon.level).to.equal(level);
        expect(await contract.tokenURI(pokemon.id)).to.contain(name);
    };

    it("Contract", async () => {
        const { contract, owner } = await loadFixture(fixture);
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("Mint", async () => {
        const { contract, owner } = await loadFixture(fixture);
        await expect(mint(contract, owner, pokemons.charmander.name, pokemons.charmander.stats, pokemons.charmander.evolutions)).to.be.not.reverted;
    });

    it("Pause - Unpause", async () => {
        const { contract, owner } = await loadFixture(fixture);
        await expect(mint(contract, owner, pokemons.charmander.name, pokemons.charmander.stats, pokemons.charmander.evolutions)).to.be.not.reverted;
        await contract.pause();
        await expect(mint(contract, owner, pokemons.charmander.name, pokemons.charmander.stats, pokemons.charmander.evolutions)).to.be.reverted;
        await contract.unpause();
        await expect(mint(contract, owner, pokemons.charmander.name, pokemons.charmander.stats, pokemons.charmander.evolutions)).to.be.not.reverted;
    });

    it("List", async () => {
        const { contract, owner } = await loadFixture(fixture);
        await mint(contract, owner, pokemons.charmander.name, pokemons.charmander.stats, pokemons.charmander.evolutions);
        await mint(contract, owner, pokemons.squirtle.name, pokemons.squirtle.stats, pokemons.squirtle.evolutions);
        const list = await contract.listPokemons();
        expect(list.length).to.equal(2);
        await Promise.all([verify(contract, list[0], pokemons.charmander.name, 1), verify(contract, list[1], pokemons.squirtle.name, 1)]);
    });

    it("Get -> Reverted", async () => {
        const { contract, signer1 } = await loadFixture(fixture);
        await mint(contract, signer1, pokemons.charmander.name, pokemons.charmander.stats, pokemons.charmander.evolutions);
        await expect(contract.getPokemon(1)).to.be.revertedWith("You must own the Pokemon!");
    });

    it("Get", async () => {
        const { contract, owner } = await loadFixture(fixture);
        await mint(contract, owner, pokemons.charmander.name, pokemons.charmander.stats, pokemons.charmander.evolutions);
        await verify(contract, await contract.connect(owner).getPokemon(1), pokemons.charmander.name, 1);
    });

    it("Battle -> Reverted", async () => {
        const { contract, owner, signer1, signer2 } = await loadFixture(fixture);
        await mint(contract, signer1, pokemons.charmander.name, pokemons.charmander.stats, pokemons.charmander.evolutions);
        await mint(contract, signer2, pokemons.squirtle.name, pokemons.squirtle.stats, pokemons.squirtle.evolutions);
        await expect(contract.connect(owner).battle(1, 2)).to.be.revertedWith("You must own at least one of the Pokemons!");
    });

    it("Battle", async () => {
        const { contract, signer1, signer2 } = await loadFixture(fixture);
        await mint(contract, signer1, pokemons.charmander.name, pokemons.charmander.stats, pokemons.charmander.evolutions);
        await mint(contract, signer2, pokemons.squirtle.name, pokemons.squirtle.stats, pokemons.squirtle.evolutions);

        await expect(contract.connect(signer1).battle(1, 2)).to.emit(contract, "Result").withArgs(1, 2, anyValue);
        await expect(contract.connect(signer2).battle(2, 1)).to.emit(contract, "Result").withArgs(1, 2, anyValue).to.emit(contract, "Evolved").withArgs(1);

        verify(contract, await contract.connect(signer1).getPokemon(1), pokemons.charmander.evolutions[0].name, 2);
        verify(contract, await contract.connect(signer2).getPokemon(2), pokemons.squirtle.name, 1);
    });
});
