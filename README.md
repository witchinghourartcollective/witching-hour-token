# Witching Hour Token

Hardhat project for the `HourToken` ERC-20 contract.

## Environment

Create a `.env` file with:

```shell
PRIVATE_KEY=0x...
LIQUIDITY_WALLET=0x...
REWARD_WALLET=0x...
```

`PRIVATE_KEY` is optional for local compile and test. It is only used for Base deployment when it is a valid 32-byte hex private key.

## Commands

```shell
npm run compile
npm test
npm run deploy
```

## Contract behavior covered by tests

- Constructor mints the fixed supply to the deployer
- Non-exempt wallets cannot transfer before trading is enabled
- Transfers apply burn, liquidity, and reward fees
- Burn fee doubles during configured witching hours
