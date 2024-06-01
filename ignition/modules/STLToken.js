const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const STLTokenModule = buildModule("STLTokenModule", (m) => {
  const owner = m.getAccount(0);
  const erc20Token = m.contract("STLToken", [owner]);
  return { erc20Token };
});

module.exports = STLTokenModule;
