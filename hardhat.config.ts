import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY ?? "";
const accounts = /^0x[a-fA-F0-9]{64}$/.test(privateKey) ? [privateKey] : [];

export default defineConfig({
  plugins: [hardhatEthers, hardhatVerify],
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: false, runs: 200 },
      evmVersion: "shanghai"
    }
  },
  networks: {
    base: {
      type: "http",
      chainType: "op",
      chainId: 8453,
      url: "https://mainnet.base.org",
      accounts
    }
  },
  verify: {
    etherscan: {
      apiKey: process.env.BASESCAN_API_KEY || ""
    }
  }
});
