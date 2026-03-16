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

See `.env.example` for the tracked template.

## Commands

```shell
npm run compile
npm test
npm run deploy
npm run inspect:base
```

## Contract behavior covered by tests

- Constructor mints the fixed supply to the deployer
- Non-exempt wallets cannot transfer before trading is enabled
- Transfers apply burn, liquidity, and reward fees
- Burn fee doubles during configured witching hours

## App handoff

Use these tracked files when handing the token to an app team or Replit:

- `src/integration/hourToken.ts`: deployed address, Base chain config, token metadata, and app-facing ABI
- `INTEGRATION.md`: live deployment state and integration notes
- `.env.example`: placeholder environment variables only
