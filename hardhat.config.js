/** @type import('hardhat/config').HardhatUserConfig */

// const ALCHEMY_API_KEY = vars.get("INFURA_API_KEY");
// const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");
// const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

require("@nomicfoundation/hardhat-ignition-ethers");
module.exports = {
  solidity: "0.8.24",
  // etherscan: {
  //   apiKey: ETHERSCAN_API_KEY,
  // },
  // networks: {
  //   sepolia: {
  //     url: `https://sepolia.infura.io/v3/${ALCHEMY_API_KEY}`,
  //     accounts: [SEPOLIA_PRIVATE_KEY],
  //   },
  // },
};
