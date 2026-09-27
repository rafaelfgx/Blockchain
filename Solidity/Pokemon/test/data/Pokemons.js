const pokemons = {
    charmander(overrides = {}) {
        return {
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
                { name: "Charmeleon", level: 2 },
                { name: "Charizard", level: 3 }
            ],
            ...overrides
        };
    },
    squirtle(overrides = {}) {
        return {
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
                { name: "Wartortle", level: 2 },
                { name: "Blastoise", level: 3 }
            ],
            ...overrides
        };
    }
};

export default pokemons;
