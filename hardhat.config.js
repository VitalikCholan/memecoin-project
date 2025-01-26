require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.INFURA_SEPOLIA_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },

    base_sepolia: {
      url: process.env.INFURA_BASE_SEPOLIA_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },

    base: {
      url: process.env.INFURA_BASE_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
