const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("FaucetMSC", function () {
  let MSC, msc, Faucet, faucet;
  let owner, user1, user2;
  const INITIAL_SUPPLY = ethers.parseEther("50000000"); // 50M tokens
  const FAUCET_SUPPLY = ethers.parseEther("10000"); // 10K tokens for faucet
  const AMOUNT_PER_REQUEST = ethers.parseEther("10"); // 10 tokens per request

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy MSC token
    MSC = await ethers.getContractFactory("MemecoinSuperCycle");
    msc = await MSC.deploy(50000000); // 50M cap
    await msc.waitForDeployment();

    // Deploy Faucet
    Faucet = await ethers.getContractFactory("FaucetMSC");
    faucet = await Faucet.deploy(await msc.getAddress());
    await faucet.waitForDeployment();

    // Transfer tokens to faucet
    await msc.transfer(await faucet.getAddress(), FAUCET_SUPPLY);
  });

  describe("Deployment", function () {
    it("Should verify that the faucet contract has the correct token address", async function () {
      expect(await faucet.token()).to.equal(await msc.getAddress());
    });

    it("Should set the right owner", async function () {
      expect(await faucet.owner()).to.equal(owner.address);
    });

    it("Should have correct initial balance", async function () {
      expect(await faucet.getBalance()).to.equal(FAUCET_SUPPLY);
    });
  });

  describe("Token Requests", function () {
    it("Should dispense tokens correctly", async function () {
      await faucet.connect(user1).requestTokens();
      expect(await msc.balanceOf(user1.address)).to.equal(AMOUNT_PER_REQUEST);
    });

    it("Should fail if requesting too soon", async function () {
      await faucet.connect(user1).requestTokens();
      await expect(faucet.connect(user1).requestTokens()).to.be.revertedWith(
        "Please wait 1 minutes between requests"
      );
    });

    it("Should allow request after lockTime", async function () {
      await faucet.connect(user1).requestTokens();
      await time.increase(61); // Wait 61 seconds
      await faucet.connect(user1).requestTokens();
      expect(await msc.balanceOf(user1.address)).to.equal(
        AMOUNT_PER_REQUEST * BigInt(2)
      );
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to change amount per request", async function () {
      const newAmount = ethers.parseEther("20");
      await faucet.setAmountPerRequest(newAmount);
      expect(await faucet.amountPerRequest()).to.equal(newAmount);
    });

    it("Should allow owner to change lock time", async function () {
      const newTime = 120; // 2 minutes
      await faucet.setLockTime(newTime);
      expect(await faucet.lockTime()).to.equal(newTime);
    });

    it("Should allow owner to withdraw tokens", async function () {
      const withdrawAmount = ethers.parseEther("1000");
      await faucet.withdrawTokens(withdrawAmount);
      expect(await msc.balanceOf(owner.address)).to.equal(
        INITIAL_SUPPLY - FAUCET_SUPPLY + withdrawAmount
      );
    });

    it("Should fail if non-owner tries to withdraw", async function () {
      await expect(
        faucet.connect(user1).withdrawTokens(ethers.parseEther("1000"))
      )
        .to.be.revertedWithCustomError(faucet, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });
  });

  describe("View Functions", function () {
    it("Should return correct time until next request", async function () {
      await faucet.connect(user1).requestTokens();
      expect(
        await faucet.timeUntilNextRequest(user1.address)
      ).to.be.greaterThan(0);
    });

    it("Should return 0 for users who haven't requested", async function () {
      expect(await faucet.timeUntilNextRequest(user2.address)).to.equal(0);
    });
  });
});
