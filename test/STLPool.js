const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-as-promised"));
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Pool contract tests", function () {
  let erc20, pool, poolAddress, ht, alice, bob;

  const aliceAmount = 100n;
  const bobAmount = 300n;
  const htAmount = 200n;

  async function deployToken() {
    const accounts = await ethers.getSigners();
    ht = accounts[0];
    alice = accounts[1];
    bob = accounts[2];

    erc20 = await ethers.deployContract("STLToken", [ht]);
    await erc20.waitForDeployment();
    const erc20Address = erc20.getAddress();

    pool = await ethers.deployContract("STLPool", [ht, erc20Address]);
    poolAddress = await pool.getAddress();
    await pool.waitForDeployment();
  }

  it("Should allow Alice to deposit on the pool", async function () {
    // we deploy the contracts
    await loadFixture(deployToken);

    await erc20.connect(ht).mint(alice.address, aliceAmount);
    expect(erc20.balanceOf(alice.address)).to.eventually.equal(aliceAmount);

    await erc20.connect(alice).approve(poolAddress, aliceAmount);
    await pool.connect(alice).deposit(aliceAmount);

    expect(pool.getContractBalance()).to.eventually.equal(aliceAmount);
  });

  it("Should allow Bob to deposit on the pool", async function () {
    await erc20.connect(ht).mint(bob.address, bobAmount);
    expect(erc20.balanceOf(bob.address)).to.eventually.equal(bobAmount);

    await erc20.connect(bob).approve(poolAddress, bobAmount);
    await pool.connect(bob).deposit(bobAmount);

    expect(pool.getContractBalance()).to.eventually.equal(
      aliceAmount + bobAmount
    );
  });

  it("Should allow HT to reward on the pool", async function () {
    await erc20.connect(ht).mint(ht.address, htAmount);

    await erc20.connect(ht).approve(poolAddress, htAmount);
    await pool.connect(ht).addRewards(htAmount);

    expect(pool.totalRewards()).to.eventually.equal(htAmount);
  });

  it("Should not allow a non owner account to reward on the pool", async function () {
    await expect(pool.connect(alice).addRewards(aliceAmount)).to.eventually.be
      .rejected;
  });

  it("Should allow Alice and Bob to withdraw the correct amount - 1st scenario", async function () {
    await pool.connect(bob).withdraw();
    expect(erc20.balanceOf(bob.address)).to.eventually.equal(450n);

    await pool.connect(alice).withdraw();
    expect(erc20.balanceOf(alice.address)).to.eventually.equal(150n);
  });

  it("Should allow Alice and Bob to withdraw the correct amount - 2nd scenario", async function () {
    // second scenario
    await erc20.connect(alice).approve(poolAddress, aliceAmount);
    await pool.connect(alice).deposit(aliceAmount);

    await erc20.connect(ht).mint(ht.address, htAmount);
    await erc20.connect(ht).approve(poolAddress, htAmount);
    await pool.connect(ht).addRewards(htAmount);

    await erc20.connect(bob).approve(poolAddress, bobAmount);
    await pool.connect(bob).deposit(bobAmount);

    await pool.connect(alice).withdraw();
    expect(erc20.balanceOf(alice.address)).to.eventually.equal(300n);

    await pool.connect(bob).withdraw();
    expect(erc20.balanceOf(bob.address)).to.eventually.equal(bobAmount);
  });

  it("Should not allow Alice to withdraw without a deposit", async function () {
    await expect(pool.connect(alice).withdraw()).to.eventually.be.rejected;
  });

  it("Should not allow Bob to perform multiple deposits without withdraws", async function () {
    await erc20.connect(bob).approve(poolAddress, bobAmount);
    await pool.connect(bob).deposit(10n);

    expect(pool.connect(bob).deposit(10n)).to.eventually.be.rejectedWith(
      "Investor already deposit."
    );
  });
});
