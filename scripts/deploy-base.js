async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MSC = await ethers.getContractFactory("MemecoinSuperCycle");
  const msc = await MSC.deploy(50000000); // 50M cap
  await msc.waitForDeployment();
  console.log("MSC Token deployed to:", await msc.getAddress());

  const Faucet = await ethers.getContractFactory("FaucetMSC");
  const faucet = await Faucet.deploy(await msc.getAddress());
  await faucet.waitForDeployment();
  console.log("Faucet deployed to:", await faucet.getAddress());

  const faucetAmount = ethers.parseEther("10000"); // 10K tokens
  await msc.transfer(await faucet.getAddress(), faucetAmount);
  console.log("Transferred tokens to faucet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
