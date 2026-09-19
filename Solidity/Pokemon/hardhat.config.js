import { configVariable, defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

export default defineConfig({
    plugins: [hardhatToolboxMochaEthers],
    solidity: {
        profiles: {
            default: {
                version: "0.8.34"
            },
            production: {
                version: "0.8.34",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    },
                    viaIR: true
                }
            }
        }
    },
    networks: {
        production: {
            type: "http",
            chainType: "l1",
            url: configVariable("RPC_URL"),
            accounts: [configVariable("PRIVATE_KEY")]
        }
    },
    verify: {
        etherscan: {
            apiKey: configVariable("ETHERSCAN_API_KEY")
        }
    }
});
