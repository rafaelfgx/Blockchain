# Blockchain

Transaction ledger (digital, decentralized, distributed, immutable and public).

## Consensus Algorithm

Validate and confirm transactions to add a block to the chain.

### Proof of Work (PoW)

First consensus algorithm.

Miner solves a complex hashing puzzle using computational processing, requiring huge amounts of energy.

Mining reward is paid to the miner who solves the puzzle first.

Attacker needs to have computational processing more powerful than 51% of the network to tampering the chain.

Susceptible to a future Tragedy of Commons. Reward decreases over time, making it possible to own 51% of the network.

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
      "DateTime": "2021-07-03T21:59:46.2845741Z",
      "Hash": "1T6f21MYYemsxI4EKEV6wyX2wlXTqDkfsnb/pTB4bLM="
    },
    {
      "Index": 1,
      "DateTime": "2021-07-03T21:59:46.3233224Z",
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
      ],
      "PreviousHash": "1T6f21MYYemsxI4EKEV6wyX2wlXTqDkfsnb/pTB4bLM=",
      "Hash": "9zwBP6QXAk3TQ4aWqfvnJRBDtUjkdJXxmZZ0CXSIX/k="
    },
    {
      "Index": 2,
      "DateTime": "2021-07-03T21:59:48.5104227Z",
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
      ],
      "PreviousHash": "9zwBP6QXAk3TQ4aWqfvnJRBDtUjkdJXxmZZ0CXSIX/k=",
      "Hash": "AJkcd/xYNVQ0dmlyn0yYImcriy3OEO0qjgMp8dTsIz8="
    }
  ],
  "Valid": true
}
```
