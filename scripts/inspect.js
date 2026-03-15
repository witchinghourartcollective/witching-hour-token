import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const tokenAddress =
  process.env.TOKEN_ADDRESS || "0xFC1c0FFF99845676A588CE21c28C4859F3035866";
const deployerAddress =
  process.env.DEPLOYER_ADDRESS || "0x52864a2EabcBa4E8421e541c8E0Ca74c55724732";
const rpcUrl = process.env.BASE_RPC_URL || "https://mainnet.base.org";

const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function owner() view returns (address)",
  "function balanceOf(address) view returns (uint256)",
  "function liquidityWallet() view returns (address)",
  "function rewardWallet() view returns (address)",
  "function tradingEnabled() view returns (bool)",
  "function burnFee() view returns (uint256)",
  "function liquidityFee() view returns (uint256)",
  "function rewardFee() view returns (uint256)",
  "function witchingStart() view returns (uint256)",
  "function witchingEnd() view returns (uint256)",
];

async function main() {
  const provider = new ethers.JsonRpcProvider(rpcUrl, 8453, {
    staticNetwork: true,
  });
  const token = new ethers.Contract(tokenAddress, abi, provider);

  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();
  const deployerBalance = await token.balanceOf(deployerAddress);
  const expectedSupply = 21369777n * 10n ** BigInt(decimals);

  const report = {
    tokenAddress,
    deployerAddress,
    liquidityWalletEnv: process.env.LIQUIDITY_WALLET || null,
    rewardWalletEnv: process.env.REWARD_WALLET || null,
    rpcUrl,
    name: await token.name(),
    symbol: await token.symbol(),
    decimals: String(decimals),
    totalSupply: totalSupply.toString(),
    owner: await token.owner(),
    deployerBalance: deployerBalance.toString(),
    liquidityWallet: await token.liquidityWallet(),
    rewardWallet: await token.rewardWallet(),
    tradingEnabled: await token.tradingEnabled(),
    burnFee: String(await token.burnFee()),
    liquidityFee: String(await token.liquidityFee()),
    rewardFee: String(await token.rewardFee()),
    witchingStart: String(await token.witchingStart()),
    witchingEnd: String(await token.witchingEnd()),
    expectedSupply: expectedSupply.toString(),
    totalSupplyMatchesExpected: totalSupply === expectedSupply,
    deployerHoldsEntireSupply: deployerBalance === totalSupply,
    constructorWalletsMatchEnv:
      (await token.liquidityWallet()) === (process.env.LIQUIDITY_WALLET || "") &&
      (await token.rewardWallet()) === (process.env.REWARD_WALLET || ""),
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
