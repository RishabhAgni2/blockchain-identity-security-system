require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.BLOCKCHAIN_PRIVATE_KEY],
    },
  },
};