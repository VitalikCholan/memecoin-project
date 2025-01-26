const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MemecoinSuperCycle = await hre.ethers.getContractFactory(
    "MemecoinSuperCycle"
  );
  const memecoinSuperCycle = await MemecoinSuperCycle.deploy(50000000);

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
