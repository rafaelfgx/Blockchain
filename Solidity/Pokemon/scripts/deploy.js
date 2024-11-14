const { ethers } = require("hardhat");

const main = async () => {
    const [owner] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("PokemonBattle");
    contract = await factory.deploy(owner.address);
    console.log("Owner Address:", owner.address);
    console.log("Contract Address:", contract.target);
};

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
