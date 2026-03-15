import dotenv from "dotenv";
import { network } from "hardhat";

dotenv.config();

async function main() {
  const { ethers } = await network.connect();

  const liquidityWallet = process.env.LIQUIDITY_WALLET;
  const rewardWallet = process.env.REWARD_WALLET;

  if (!liquidityWallet || !rewardWallet) {
    throw new Error("Missing wallet addresses in .env");
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying Witching hOUR token...");
  console.log("Deployer:", deployer.address);

  const token = await ethers.deployContract("HourToken", [
    liquidityWallet,
    rewardWallet,
  ]);

  await token.waitForDeployment();

  const address = await token.getAddress();

  console.log("hOUR token deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
