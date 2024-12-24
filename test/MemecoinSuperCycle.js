const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("MemecoinSuperCycle contract", function () {
  // global vars
  let token;
  let memecoinSuperCycle;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;

  this.beforeEach(async function () {
    token = await ethers.getContractFactory("MemecoinSuperCycle");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    memecoinSuperCycle = await token.deploy(tokenCap);
    console.log(memecoinSuperCycle.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await memecoinSuperCycle.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await memecoinSuperCycle.balanceOf(owner.address);
      expect(await memecoinSuperCycle.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during development", async function () {
      const cap = await memecoinSuperCycle.cap();
      expect(Number(hre.ethers.formatEther(cap))).to.equal(tokenCap);
    });

    describe("Transaction", function () {
      it("Should transfer tokens between accounts", async function () {
        await memecoinSuperCycle.transfer(addr1.address, 50);
        const addr1Balance = await memecoinSuperCycle.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(50);

        await memecoinSuperCycle.connect(addr1).transfer(addr2.address, 50);
        const addr2Balance = await memecoinSuperCycle.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(50);
      });

      it("Should fail if sender doesn't have enough tokens", async function () {
        const initialOwnerBalance = await memecoinSuperCycle.balanceOf(
          owner.address
        );

        const from = addr1.address;
        const fromBalance = await memecoinSuperCycle.balanceOf(from);

        await expect(
          memecoinSuperCycle.connect(addr1).transfer(owner.address, 1)
        )
          .to.be.revertedWithCustomError(
            memecoinSuperCycle,
            "ERC20InsufficientBalance"
          )
          .withArgs(from, fromBalance, 1);

        expect(await memecoinSuperCycle.balanceOf(owner.address)).to.equal(
          initialOwnerBalance
        );
      });

      it("Should update balances after transfers", async function () {
        const initialOwnerBalance = await memecoinSuperCycle.balanceOf(
          owner.address
        );

        await memecoinSuperCycle.transfer(addr1.address, 100);

        await memecoinSuperCycle.transfer(addr2.address, 50);

        const finalOwnerBalance = await memecoinSuperCycle.balanceOf(
          owner.address
        );
        expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(150));

        const addr1Balance = await memecoinSuperCycle.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(100);

        const addr2Balance = await memecoinSuperCycle.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(50);
      });
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause the contract", async function () {
      // Pause the contract
      await memecoinSuperCycle.pause();
      expect(await memecoinSuperCycle.paused()).to.equal(true);

      // Pause the contract
      await expect(
        memecoinSuperCycle.transfer(addr1.address, 100)
      ).to.be.revertedWithCustomError(memecoinSuperCycle, "EnforcedPause");

      // Unpause the contract
      await memecoinSuperCycle.unpause();
      expect(await memecoinSuperCycle.paused()).to.equal(false);

      // Transfer should work after unpausing
      await memecoinSuperCycle.transfer(addr1.address, 100);
      expect(await memecoinSuperCycle.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should only allow owner to pause/unpause", async function () {
      // Non-owner tries to pause
      await expect(memecoinSuperCycle.connect(addr1).pause())
        .to.be.revertedWithCustomError(
          memecoinSuperCycle,
          "OwnableUnauthorizedAccount"
        )
        .withArgs(addr1.address);

      // Owner pauses
      await memecoinSuperCycle.pause();

      // Non-owner tries to unpause
      await expect(memecoinSuperCycle.connect(addr1).unpause())
        .to.be.revertedWithCustomError(
          memecoinSuperCycle,
          "OwnableUnauthorizedAccount"
        )
        .withArgs(addr1.address);
    });
  });

  describe("Permit", function () {
    it("Should permit and execute transfer", async function () {
      const amount = 100;
      const deadline = ethers.MaxUint256;
      const nonce = await memecoinSuperCycle.nonces(owner.address);
      const name = await memecoinSuperCycle.name();

      // Get the domain separator
      const domain = {
        name: name,
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: memecoinSuperCycle.target,
      };

      // Create the permit type data
      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      // Create the permit data
      const values = {
        owner: owner.address,
        spender: addr1.address,
        value: amount,
        nonce: nonce,
        deadline: deadline,
      };

      // Sign the permit
      const signature = await owner.signTypedData(domain, types, values);
      const sig = ethers.Signature.from(signature);

      // Execute the permit
      await memecoinSuperCycle.permit(
        owner.address,
        addr1.address,
        amount,
        deadline,
        sig.v,
        sig.r,
        sig.s
      );

      // Verify the allowance was set
      expect(
        await memecoinSuperCycle.allowance(owner.address, addr1.address)
      ).to.equal(amount);

      // Test that addr1 can now transfer tokens using the permit
      await memecoinSuperCycle
        .connect(addr1)
        .transferFrom(owner.address, addr1.address, amount);

      expect(await memecoinSuperCycle.balanceOf(addr1.address)).to.equal(
        amount
      );
    });

    it("Should fail with expired deadline", async function () {
      const amount = 100;
      const deadline = 0; // Expired deadline
      const nonce = await memecoinSuperCycle.nonces(owner.address);
      const name = await memecoinSuperCycle.name();

      const domain = {
        name: name,
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: memecoinSuperCycle.target,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const values = {
        owner: owner.address,
        spender: addr1.address,
        value: amount,
        nonce: nonce,
        deadline: deadline,
      };

      const signature = await owner.signTypedData(domain, types, values);
      const sig = ethers.Signature.from(signature);

      await expect(
        memecoinSuperCycle.permit(
          owner.address,
          addr1.address,
          amount,
          deadline,
          sig.v,
          sig.r,
          sig.s
        )
      ).to.be.revertedWithCustomError(
        memecoinSuperCycle,
        "ERC2612ExpiredSignature"
      );
    });
  });
});
