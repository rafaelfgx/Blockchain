import { expect } from "chai";
import hardhat from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";

const { ethers } = await hardhat.network.connect();

const fixture = async () => {
    const [owner, signer1, signer2] = await ethers.getSigners();
    const contract = await ethers.deployContract("Game", [owner.address]);
    return { ethers, contract, owner, signer1, signer2 };
}

const pokemons = {
    charmander: {
        id: 0,
        name: "Charmander",
        element: 1,
        level: 1,
        hp: 100,
        attack: 100,
        defense: 100,
        speed: 100,
        specialAttack: 100,
        specialDefense: 100,
        xp: 0,
        evolutions: [
            {
                name: "Charmeleon",
                level: 2
            },
            {
                name: "Charizard",
                level: 3
            }
        ]
    },
    squirtle: {
        id: 0,
        name: "Squirtle",
        element: 2,
        level: 1,
        hp: 50,
        attack: 50,
        defense: 50,
        speed: 50,
        specialAttack: 50,
        specialDefense: 50,
        xp: 0,
        evolutions: [
            {
                name: "Wartortle",
                level: 2
            },
            {
                name: "Blastoise",
                level: 3
            }
        ]
    }
};

const verify = async (contract, pokemon, name, level) => {
    expect(pokemon.name).to.equal(name);
    expect(pokemon.level).to.equal(level);
    expect(await contract.tokenURI(pokemon.id)).to.contain(name);
};

describe("Game", () => {
    it("Contract", async () => {
        const { contract, owner } = await fixture();
        expect(await contract.owner()).to.equal(owner.address);
    });

    it("Mint", async () => {
        const { contract, owner } = await fixture();
        await contract.mint(owner.address, pokemons.charmander);
    });

    it("PauseUnpause", async () => {
        const { ethers, contract, owner } = await fixture();

        await contract.mint(owner.address, pokemons.charmander);

        await contract.pause();
        expect(contract.mint(owner.address, pokemons.charmander)).to.revert(ethers);

        await contract.unpause();
        await contract.mint(owner.address, pokemons.charmander);
    });

    it("List", async () => {
        const { contract, owner } = await fixture();

        await contract.mint(owner.address, pokemons.charmander);
        await contract.mint(owner.address, pokemons.squirtle);

        const list = await contract.listPokemons();
        expect(list.length).to.equal(2);

        await Promise.all([
            verify(contract, list[0], pokemons.charmander.name, 1),
            verify(contract, list[1], pokemons.squirtle.name, 1)
        ]);
    });

    it("GetReverted", async () => {
        const { ethers, contract, signer1 } = await fixture();
        await contract.mint(signer1.address, pokemons.charmander);
        await expect(contract.getPokemon(1)).to.revert("You must own the Pokemon!", ethers);
    });

    it("Get", async () => {
        const { contract, owner } = await fixture();
        await contract.mint(owner.address, pokemons.charmander);
        await verify(contract, await contract.connect(owner).getPokemon(1), pokemons.charmander.name, 1);
    });

    it("BattleReverted", async () => {
        const { ethers, contract, owner, signer1, signer2 } = await fixture();
        await contract.mint(signer1.address, pokemons.charmander);
        await contract.mint(signer2.address, pokemons.squirtle);
        await expect(contract.connect(owner).battle(1, 2)).to.revert("You must own at least one of the Pokemons!", ethers);
    });

    it("Battle", async () => {
        const { contract, signer1, signer2 } = await fixture();
        await contract.mint(signer1.address, pokemons.charmander);
        await contract.mint(signer2.address, pokemons.squirtle);

        await expect(contract.connect(signer1).battle(1, 2)).to.emit(contract, "Result").withArgs(1, 2, anyValue);
        await expect(contract.connect(signer2).battle(2, 1)).to.emit(contract, "Result").withArgs(1, 2, anyValue).to.emit(contract, "Evolved").withArgs(1);

        await verify(contract, await contract.connect(signer1).getPokemon(1), pokemons.charmander.evolutions[0].name, 2);
        await verify(contract, await contract.connect(signer2).getPokemon(2), pokemons.squirtle.name, 1);
    });
});
