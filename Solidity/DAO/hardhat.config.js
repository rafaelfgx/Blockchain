import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

export default defineConfig({
    plugins: [hardhatToolboxMochaEthers],
    solidity: {
        version: "0.8.34",
        npmFilesToBuild: [
            "@openzeppelin/contracts/governance/TimelockController.sol"
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 100
            },
            viaIR: true,
            metadata: {
                bytecodeHash: "none"
            }
        }
    }
});
