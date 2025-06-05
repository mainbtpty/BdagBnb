require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");

module.exports = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    contracts: ["./contracts", "./mocks"],
  },
  networks: {
    blockdag: {
      url: process.env.BLOCKDAG_RPC_URL || "https://rpc.primordial.bdagscan.com/",
      chainId: 1043,
      accounts: [process.env.PRIVATE_KEY],
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
    },
  },
  gasReporter: {
    enabled: true,
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};