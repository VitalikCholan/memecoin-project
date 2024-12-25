const hre = require("hardhat");

async function main() {
  const MemecoinSuperCycle = await hre.ethers.getContractFactory(
    "MemecoinSuperCycle"
  );
  const memecoinSuperCycle = await MemecoinSuperCycle.deploy(1000000000);

  await memecoinSuperCycle.waitForDeployment();

  console.log(
    `MemecoinSuperCycle deployed to:${await memecoinSuperCycle.getAddress()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
