async function main() {
  // Your token address
  const TOKEN_ADDRESS = "0x522E94f0EfeFBd35A9b811a3bc682009Ab5dfE3b";

  // Get token contract
  const token = await ethers.getContractAt("MemecoinSuperCycle", TOKEN_ADDRESS);

  // Get your address (deployer/owner)
  const [owner] = await ethers.getSigners();

  // Check balance
  const balance = await token.balanceOf(owner.address);
  console.log(`Your balance: ${ethers.formatEther(balance)} MSC tokens`);
}

main();
