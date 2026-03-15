import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("HourToken", function () {
  async function deployHourToken() {
    const [owner, liquidityWallet, rewardWallet, alice, bob] =
      await ethers.getSigners();

    const token = await ethers.deployContract("HourToken", [
      liquidityWallet.address,
      rewardWallet.address,
    ]);

    return { token, owner, liquidityWallet, rewardWallet, alice, bob };
  }

  it("mints the full supply to the owner in the constructor", async function () {
    const { token, owner } = await deployHourToken();
    const expectedSupply = 21_369_777n * 10n ** 18n;

    expect(await token.totalSupply()).to.equal(expectedSupply);
    expect(await token.balanceOf(owner.address)).to.equal(expectedSupply);
  });

  it("blocks transfers for non-exempt wallets until trading is enabled", async function () {
    const { token, owner, alice, bob } = await deployHourToken();

    await token.transfer(alice.address, 1_000n);

    await expect(token.connect(alice).transfer(bob.address, 100n))
      .to.be.revertedWith("Trading not live");

    await token.enableTrading();

    await expect(token.connect(alice).transfer(bob.address, 100n))
      .to.not.be.reverted;

    expect(await token.balanceOf(bob.address)).to.equal(93n);
  });

  it("distributes burn, liquidity, and reward fees on transfer", async function () {
    const { token, alice, bob, liquidityWallet, rewardWallet } =
      await deployHourToken();

    await token.transfer(alice.address, 1_000n);
    await token.enableTrading();

    await token.connect(alice).transfer(bob.address, 100n);

    expect(await token.balanceOf(bob.address)).to.equal(93n);
    expect(await token.balanceOf(liquidityWallet.address)).to.equal(3n);
    expect(await token.balanceOf(rewardWallet.address)).to.equal(2n);
    expect(await token.balanceOf("0x000000000000000000000000000000000000dEaD"))
      .to.equal(2n);
  });

  it("doubles the burn fee during witching hours", async function () {
    const { token, alice, bob, liquidityWallet, rewardWallet } =
      await deployHourToken();

    await token.transfer(alice.address, 1_000n);
    await token.enableTrading();

    const latestBlock = await ethers.provider.getBlock("latest");
    const timestamp = latestBlock!.timestamp;

    await token.setWitchingHours(timestamp - 1, timestamp + 3_600);
    await token.connect(alice).transfer(bob.address, 100n);

    expect(await token.balanceOf(bob.address)).to.equal(91n);
    expect(await token.balanceOf(liquidityWallet.address)).to.equal(3n);
    expect(await token.balanceOf(rewardWallet.address)).to.equal(2n);
    expect(await token.balanceOf("0x000000000000000000000000000000000000dEaD"))
      .to.equal(4n);
  });
});
