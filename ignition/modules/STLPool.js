const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const STLPoolModule = buildModule("STLPoolModule", (m) => {
  const owner = m.getAccount(0);
  const erc20 = m.getParameter("erc20");
  const pool = m.contract("STLPool", [owner, erc20]);

  return { pool };
});

module.exports = STLPoolModule;
