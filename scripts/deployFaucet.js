const hre = require("hardhat");

async function main() {
  const TOKEN_ADDRESS = "0x522E94f0EfeFBd35A9b811a3bc682009Ab5dfE3b";

  // Deploy Faucet
  const Faucet = await hre.ethers.getContractFactory("FaucetMSC");
  const faucet = await Faucet.deploy(TOKEN_ADDRESS);
  await faucet.waitForDeployment();

  console.log("Faucet deployed to:", await faucet.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
