const { ethers } = require("hardhat");

const main = async () => {
    const [owner] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("Game");
    const contract = await factory.deploy(owner.address);
    console.log("Owner:", owner.address);
    console.log("Contract:", contract.address);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
