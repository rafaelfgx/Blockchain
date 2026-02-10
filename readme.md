# Blockchain

![](https://github.com/rafaelfgx/Blockchain/actions/workflows/build.yaml/badge.svg)

![](https://repository-images.githubusercontent.com/382630862/a5ed93b3-6d80-4c72-807f-04181c0c4c3f)

## Consensus Algorithm

Validate and confirm transactions to add a block to the chain.

### Proof of Work (PoW)

First consensus algorithm.

Miner solves a complex hashing puzzle using computational processing, requiring huge amounts of energy.

Mining reward is paid to the miner who solves the puzzle first.

Attacker needs to have computational processing more powerful than 51% of the network to tampering the chain.

Susceptible to a future Tragedy of the Commons, as declining rewards may enable 51% network control.

### Proof of Stake (PoS)

Alternative to Proof of Work due to energy consumption.

Block creator is chosen based on your stake. The more the stake, the more the chance.

Block creator takes a transaction fee as reward.

Attacker needs to own 51% of the network to tampering the chain.

Not susceptible to a Tragedy of Commons. The more the stake, the more discouraged to tampering the chain.

## Example

```json
{
    "Chain": [
        {
            "Index": 0,
            "DateTime": "2049-01-01T00:00:00.0000000Z",
            "Hash": "1T6f21MYYemsxI4EKEV6wyX2wlXTqDkfsnb/pTB4bLM="
        },
        {
            "Index": 1,
            "DateTime": "2049-02-02T00:00:00.0000000Z",
            "Hash": "9zwBP6QXAk3TQ4aWqfvnJRBDtUjkdJXxmZZ0CXSIX/k=",
            "PreviousHash": "1T6f21MYYemsxI4EKEV6wyX2wlXTqDkfsnb/pTB4bLM=",
            "Transactions": [
                {
                    "From": "bob",
                    "To": "alice",
                    "Amount": 10
                },
                {
                    "To": "miner",
                    "Amount": 1
                }
            ]
        },
        {
            "Index": 2,
            "DateTime": "2049-03-03T00:00:00.0000000Z",
            "Hash": "AJkcd/xYNVQ0dmlyn0yYImcriy3OEO0qjgMp8dTsIz8=",
            "PreviousHash": "9zwBP6QXAk3TQ4aWqfvnJRBDtUjkdJXxmZZ0CXSIX/k=",
            "Transactions": [
                {
                    "From": "bob",
                    "To": "eve",
                    "Amount": 20
                },
                {
                    "From": "alice",
                    "To": "eve",
                    "Amount": 30
                },
                {
                    "To": "miner",
                    "Amount": 1
                }
            ]
        }
    ],
    "Valid": true
}
```

## Links

[Token 2049](https://www.token2049.com)

[Decentralized Trust](https://www.lfdecentralizedtrust.org)

[Hardhat](https://hardhat.org)

[Remix](https://remix.ethereum.org)

[Solidity](https://docs.soliditylang.org)

[Ethereum Improvement Proposals](https://eips.ethereum.org)

[OpenZeppelin](https://www.openzeppelin.com)

[OpenZeppelin Wizard](https://wizard.openzeppelin.com)

[Ethers.js](https://docs.ethers.org)

[InterPlanetary File System](https://ipfs.tech)

[Bitcoin Blockchain Explorer](https://blockstream.info/testnet/address/ADDRESS)

[Bitcoin Wallet](https://electrum.org)
