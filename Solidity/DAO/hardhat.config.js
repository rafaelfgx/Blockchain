import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

export default defineConfig({
    plugins: [hardhatToolboxMochaEthers],
    solidity: {
        npmFilesToBuild: [
            "@openzeppelin/contracts/governance/TimelockController.sol"
        ],
        profiles: {
            default: {
                version: "0.8.34",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 100
                    }
                }
            },
            production: {
                version: "0.8.34",
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
        }
    }
});
