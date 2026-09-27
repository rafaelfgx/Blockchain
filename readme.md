# Blockchain

![](https://github.com/rafaelfgx/Blockchain/actions/workflows/build.yaml/badge.svg)

![](https://repository-images.githubusercontent.com/382630862/ce73a836-a1a6-46d9-b474-a36d3f2611d9)

## Ebooks

| BLOCKCHAIN - CRYPTOCURRENCY | BLOCKCHAIN - CRIPTOMOEDAS |
| :-: | :-: |
| [![](https://github.com/rafaelfgx/rafaelfgx/blob/main/images/blockchain-en.png)](https://hotm.art/blockchain-cryptocurrency) | [![](https://github.com/rafaelfgx/rafaelfgx/blob/main/images/blockchain-pt.png)](https://hotm.art/blockchain-criptomoedas) |
| <div align="left">Dive into the universe of blockchain and cryptocurrencies that is revolutionizing the world! In this content, the disruptive power of this technology will be explored, ushering in a new era of decentralization, transparency, and security.</div></br><div align="left">THIS CONTENT IS NOT ANY INVESTMENT RECOMMENDATION, IT IS FOR EDUCATIONAL PURPOSES ONLY!</div> | <div align="left">Mergulhe no universo do blockchain e das criptomoedas que está revolucionando o mundo! Neste conteúdo, o poder disruptivo dessa tecnologia será explorado, inaugurando uma nova era de descentralização, transparência e segurança.</div></br><div align="left">ESTE CONTEÚDO NÃO É NENHUMA RECOMENDAÇÃO DE INVESTIMENTO, É APENAS PARA FINS EDUCACIONAIS!</div> |

## Links

- [TOKEN2049](https://www.token2049.com) - International conference focused on blockchain, cryptocurrencies, and Web3, bringing together companies, developers, investors, and industry experts.

- [LF Decentralized Trust](https://www.lfdecentralizedtrust.org) - Foundation focused on developing open-source distributed ledger (DLT) and blockchain technologies.

- [Use Cases - Consensys](https://consensys.io/blockchain-use-cases/case-studies) - Collection of blockchain use cases and case studies showing how the technology is applied across different industries.

- [Use Cases - Brazil](https://observatorioblockchain.org.br/casos-de-uso-2) - Collection of blockchain applications and initiatives in Brazil.

- [Hardhat](https://hardhat.org) - Development environment for building, testing, debugging, and deploying Ethereum smart contracts and applications.

- [Remix IDE](https://remix.ethereum.org) - Online IDE for developing, compiling, testing, and deploying Solidity smart contracts.

- [Solidity](https://docs.soliditylang.org) - Official documentation for Solidity, the programming language used to develop Ethereum smart contracts.

- [Ethereum Improvement Proposals (EIPs)](https://eips.ethereum.org) - Repository of technical proposals documenting standards, improvements, and changes to the Ethereum ecosystem.

- [OpenZeppelin](https://www.openzeppelin.com) - Platform providing secure, reusable smart-contract libraries and development tools for blockchain applications.

- [OpenZeppelin Wizard](https://wizard.openzeppelin.com) - Tool for generating smart contracts based on OpenZeppelin’s reusable contract libraries.

- [ethers.js](https://docs.ethers.org) - JavaScript/TypeScript library for interacting with the Ethereum blockchain and smart contracts.

- [InterPlanetary File System (IPFS)](https://ipfs.tech) - Decentralized protocol for storing, addressing, and sharing files based on their content rather than a central server.

- [Bitcoin Explorer](https://blockstream.info/testnet/address/ADDRESS) - Blockchain explorer for viewing Bitcoin addresses, transactions, and blocks.

- [Electrum](https://electrum.org) - Bitcoin wallet for managing keys, addresses, and transactions.

## Examples

- **[Blockchain](https://github.com/rafaelfgx/Blockchain/tree/main/Blockchain)** - Console application in C#/.NET that implements a blockchain from scratch, featuring transactions, block hashing, proof-of-work mining with difficulty and miner rewards, chain validation, and a tampering attempt demonstration.

- **[Solidity Contracts](https://github.com/rafaelfgx/Blockchain/tree/main/Solidity/Contracts)** - Hardhat project with smart contracts built on OpenZeppelin: an ERC-20 fungible token (Token) with burn, pause, and permit support; an ERC-721 non-fungible token (NFT) with IPFS metadata; and a soulbound token (SBT), a non-transferable NFT. Includes automated tests and TypeScript typings.

- **[Solidity DAO](https://github.com/rafaelfgx/Blockchain/tree/main/Solidity/DAO)** - Hardhat project implementing a Decentralized Autonomous Organization: an ERC-20 governance token with voting power (DaoToken), a governor contract (DaoGovernor) with configurable voting delay, duration, quorum, and timelock execution, and a Box contract managed through on-chain proposals.

- **[Solidity Pokemon](https://github.com/rafaelfgx/Blockchain/tree/main/Solidity/Pokemon)** - Hardhat project with an on-chain Pokemon game built as ERC-721 NFTs, where each Pokemon has elements and attributes, can battle other Pokemons, gain attribute increases, and evolve, with results emitted as blockchain events.

- **[Wallet](https://github.com/rafaelfgx/Blockchain/tree/main/Wallet)** - Node.js script that generates a Bitcoin HD wallet, creating a BIP39 mnemonic phrase, deriving keys via BIP32/BIP44, and producing a SegWit (P2WPKH) testnet address with its private and public keys.

## Production

```
npx hardhat keystore set RPC_URL

npx hardhat keystore set PRIVATE_KEY

npx hardhat keystore set ETHERSCAN_API_KEY

pnpm deploy
```
