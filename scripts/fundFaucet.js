async function main() {
  // Addresses (replace with your actual addresses)
  const FAUCET_ADDRESS = "0xe5677F16a73e894964Fc2b06fa9f2653C519a1fD";
  const TOKEN_ADDRESS = "0x522E94f0EfeFBd35A9b811a3bc682009Ab5dfE3b";

  // Amount to fund (e.g., 1,000,000 tokens for the faucet)
  const fundAmount = ethers.parseEther("1000000"); // 1 million tokens

  // Get token contract
  const token = await ethers.getContractAt("MemecoinSuperCycle", TOKEN_ADDRESS);

  // Transfer tokens to faucet
  console.log("Transferring tokens to faucet...");
  const tx = await token.transfer(FAUCET_ADDRESS, fundAmount);
  await tx.wait();

  console.log(
    `Successfully funded faucet with ${ethers.formatEther(
      fundAmount
    )} MSC tokens`
  );

  // Verify the faucet balance
  const faucetBalance = await token.balanceOf(FAUCET_ADDRESS);
  console.log(
    `Faucet balance now: ${ethers.formatEther(faucetBalance)} MSC tokens`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
