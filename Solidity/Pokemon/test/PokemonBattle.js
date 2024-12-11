const { ethers } = require("hardhat");
const { expect } = require("chai");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("PokemonBattle", function () {
    async function fixture() {
        const [owner, signer1, signer2, signer3] = await ethers.getSigners();
        const factory = await ethers.getContractFactory("PokemonBattle");
        contract = await factory.deploy(owner.address);
        return { contract, owner, signer1, signer2, signer3 };
    }

    async function mintCharmander(contract, signer) {
        const pokemon = {
            id: 0,
            name: "Charmander",
            hp: 100,
            attack: 100,
            defense: 100,
            speed: 100,
            specialAtack: 100,
            specialDefense: 100,
            element: 1,
            level: 1,
            experience: 0
        };

        const evolutions = [
            {
                name: "Charmeleon",
                level: 2
            },
            {
                name: "Charizard",
                level: 3
            }
        ];

        await contract.mint(signer.address, pokemon, evolutions);
    }

    async function mintSquirtle(contract, signer) {
        const pokemon = {
            id: 0,
            name: "Squirtle",
            hp: 50,
            attack: 50,
            defense: 50,
            speed: 50,
            specialAtack: 50,
            specialDefense: 50,
            element: 2,
            level: 1,
            experience: 0
        };

        const evolutions = [
            {
                name: "Wartortle",
                level: 2
            },
            {
                name: "Blastoise",
                level: 3
            }
        ];

        await contract.mint(signer.address, pokemon, evolutions);
    }

    async function verify(contract, pokemon, name, level) {
        expect(pokemon.name).to.equal(name);
        expect(pokemon.level).to.equal(level);
        expect(await contract.tokenURI(pokemon.id)).to.contains(name);
    }

    it("Contract", async function () {
        const { contract, owner } = await loadFixture(fixture);
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("Mint", async function () {
        const { contract, owner } = await loadFixture(fixture);
        await mintCharmander(contract, owner);
        expect((await contract.getPokemon(1))).to.not.be.undefined;
    });

    it("List", async function () {
        const { contract, owner } = await loadFixture(fixture);
        await mintCharmander(contract, owner);
        await mintSquirtle(contract, owner);
        const pokemons = await contract.listPokemons();
        expect(pokemons.length).to.equal(2);
        verify(contract, pokemons[0], "Charmander", 1);
        verify(contract, pokemons[1], "Squirtle", 1);
    });

    it("Get -> Reverted", async function () {
        const { contract, signer1 } = await loadFixture(fixture);
        await mintCharmander(contract, signer1);
        await expect(contract.getPokemon(1)).to.be.revertedWith("You must own the Pokemon!");
    });

    it("Get", async function () {
        const { contract, owner } = await loadFixture(fixture);
        await mintCharmander(contract, owner);
        const pokemon = await contract.connect(owner).getPokemon(1);
        verify(contract, pokemon, "Charmander", 1);
    });

    it("Battle -> Reverted", async function () {
        const { contract, owner, signer1, signer2 } = await loadFixture(fixture);
        await mintCharmander(contract, signer1);
        await mintSquirtle(contract, signer2);
        await expect(contract.connect(owner).battle(1, 2)).to.be.revertedWith("You must own at least one of the Pokemons!");
    });

    it("Battle", async function () {
        const { contract, signer1, signer2 } = await loadFixture(fixture);

        await mintCharmander(contract, signer1);
        await mintSquirtle(contract, signer2);

        await expect(await contract.connect(signer1).battle(1, 2)).to.emit(contract, "Result").withArgs(1, 2, anyValue);
        await expect(await contract.connect(signer2).battle(2, 1)).to.emit(contract, "Result").withArgs(1, 2, anyValue).to.emit(contract, "Evolved").withArgs(1);

        const charmeleon = await contract.connect(signer1).getPokemon(1);
        const squirtle = await contract.connect(signer2).getPokemon(2);

        verify(contract, charmeleon, "Charmeleon", 2);
        verify(contract, squirtle, "Squirtle", 1);
    });
});
