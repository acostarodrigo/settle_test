const STLTokenModule = require("../ignition/modules/STLToken");
const STLPoolModule = require("../ignition/modules/STLPool");

async function main() {
  const { erc20Token } = await hre.ignition.deploy(STLTokenModule);
  const erc20 = await erc20Token.getAddress();

  console.log(`STLToken deployed to: ${erc20}`);

  const { pool } = await hre.ignition.deploy(STLPoolModule, {
    parameters: { STLPoolModule: { erc20 } },
  });
  console.log(`STLPool deployed to: ${await pool.getAddress()}`);
}

main().catch(console.error);
