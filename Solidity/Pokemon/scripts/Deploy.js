const { ethers } = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();
    const contract = await ethers.getContractFactory("Game").then(factory => factory.deploy(owner.address));
    console.log({ owner: owner.address, contract: contract.address });
}

main().catch(error => console.error(error) || process.exit(1));
