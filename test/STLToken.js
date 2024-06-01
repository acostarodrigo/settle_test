const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("STLToken contract", function () {
  let erc20;
  const initialAmount = 10n;

  const deployToken = async () => {
    const [owner] = await ethers.getSigners();
    erc20 = await ethers.deployContract("STLToken", [owner.address]);
  };

  it("Allows the owner to mint to everyone", async function () {
    await loadFixture(deployToken);

    const [ht, alice, bob] = await ethers.getSigners();

    await erc20.mint(alice.address, initialAmount);
    await erc20.mint(bob.address, initialAmount);
    await erc20.mint(ht.address, initialAmount);

    expect(erc20.balanceOf(alice.address)).to.eventually.equal(initialAmount);
    expect(erc20.balanceOf(bob.address)).to.eventually.equal(initialAmount);
    expect(erc20.balanceOf(ht.address)).to.eventually.equal(initialAmount);
  });

  it("Will fail if someone else mints", async function () {
    await loadFixture(deployToken);
    const [alice] = await ethers.getSigners();
    expect(erc20.connect(alice).mint(alice.address, initialAmount)).to
      .eventually.be.rejected;
  });
});
