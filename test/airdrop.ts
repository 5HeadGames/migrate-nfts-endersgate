import {expect} from "chai";
import hre, {waffle, ethers} from "hardhat";
const {loadFixture} = waffle;

import {deploy} from "../utils/contracts";
import {configureAirdrop} from "../utils/airdrop";
import {EndersGate, PacksAirdrop} from "../types";
import {load} from "dotenv";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

describe.only("PacksAirdrop", () => {
  const noConfigFixture = async () => {
    const accounts = await ethers.getSigners();
    const endersGate = <EndersGate>(
      await deploy(hre, "EndersGate", accounts[0], [
        "Enders Gate",
        "GATE",
        ethers.utils.id(Math.random().toString()),
        "https://ipfs.io/ipfs/",
      ])
    );
    const airdrop = <PacksAirdrop>await deploy(hre, "PacksAirdrop", accounts[0], []);
    const testConfig = {
      addresses: accounts.map(({address}, i) => ({address, rewardId: i + 1})),
      rewards: [
        {
          id: 1,
          token: endersGate.address,
          amount: 1,
          tokenId: 1,
        },
        {
          id: 2,
          token: endersGate.address,
          amount: 2,
          tokenId: 2,
        },
        {
          id: 3,
          token: endersGate.address,
          amount: 3,
          tokenId: 3,
        },
      ],
    };

    return {
      user: accounts[0],
      accounts,
      endersGate,
      airdrop,
      testConfig,
    };
  };

  const configFixture = async () => {
    const {endersGate, airdrop, testConfig, ...rest} = await noConfigFixture();

    for (let i of testConfig.addresses) {
      await airdrop.setAddresses(i.rewardId, [i.address], [true]);
    }
    for (let i of testConfig.rewards) {
      await airdrop.setReward(i.id, i.amount, i.tokenId, i.token);
    }

    await endersGate.grantRole(await endersGate.MINTER_ROLE(), airdrop.address);

    return {
      ...rest,
      endersGate,
      airdrop,
      testConfig,
    };
  };

  const productionConfigFixture = async () => {
    const {endersGate, airdrop, testConfig, ...rest} = await noConfigFixture();

    const config = await configureAirdrop(hre, airdrop);
    await endersGate.grantRole(await endersGate.MINTER_ROLE(), airdrop.address);

    return {
      ...rest,
      endersGate,
      airdrop,
      config,
    };
  };

  describe("Initialization", () => {
    it("Should initialize roles", async () => {
      const {user, accounts, airdrop} = await loadFixture(noConfigFixture);
      expect(await airdrop.hasRole(await airdrop.DEFAULT_ADMIN_ROLE(), user.address)).to.be.equal(
        true
      );
      expect(await airdrop.hasRole(await airdrop.REWARD_MANAGER(), user.address)).to.be.equal(true);
      expect(await airdrop.hasRole(await airdrop.ADDRESS_MANAGER(), user.address)).to.be.equal(
        true
      );
    });

    it("Should allow owner to set addresses", async () => {
      const {user, accounts, airdrop, testConfig} = await loadFixture(noConfigFixture);
      const rewardId = 1;

      await expect(
        airdrop.setAddresses(
          rewardId,
          testConfig.addresses.map(({address}) => address),
          testConfig.addresses.map(() => true)
        )
      ).to.emit(airdrop, "AddressChanged");
      for (let i of testConfig.addresses) {
        expect(await airdrop.isAllowed(rewardId, i.address)).to.be.equal(true);
      }
    });

    it("Should allow owner to set rewards", async () => {
      const {accounts, airdrop, endersGate, testConfig} = await loadFixture(noConfigFixture);
      const reward = testConfig.rewards[0];

      await expect(airdrop.setReward(reward.id, reward.amount, reward.tokenId, reward.token))
        .to.emit(airdrop, "RewardChanged")
        .withArgs(reward.id, reward.token, reward.amount, reward.tokenId);

      const rewardCreated = await airdrop.reward(reward.id);
      expect(rewardCreated.tokenId).to.be.equal(reward.tokenId);
      expect(rewardCreated.token).to.be.equal(endersGate.address);
      expect(rewardCreated.amount).to.be.equal(reward.amount);
    });

    it("Should only allow owner to set addresses", async () => {
      const {user, accounts, airdrop, testConfig} = await loadFixture(noConfigFixture);
      const rewardId = 1;

      await expect(
        airdrop.connect(accounts[1]).setAddresses(
          rewardId,
          testConfig.addresses.map(({address}) => address),
          testConfig.addresses.map(() => true)
        )
      ).to.be.revertedWith("");
    });

    it("Should only allow owner to set rewards", async () => {
      const {accounts, airdrop, testConfig} = await loadFixture(noConfigFixture);
      const reward = testConfig.rewards[0];

      await expect(
        airdrop
          .connect(accounts[1])
          .setReward(reward.id, reward.amount, reward.tokenId, reward.token)
      ).to.be.revertedWith("");
    });
  });

  describe("airdrop claim", () => {
    it("Should allow users to claim their reward", async () => {
      const {airdrop, testConfig, accounts, endersGate} = await loadFixture(configFixture);
      const account = testConfig.addresses[0];
      const reward = testConfig.rewards.find((rew) => rew.id === account.rewardId);
      const wallet = accounts.find((acc) => acc.address === account.address) as SignerWithAddress;
      const prevBalance = await endersGate.balanceOf(account.address, reward?.id || 0);

      expect(prevBalance).to.be.equal(0);
      await expect(airdrop.connect(wallet).claimReward(account.rewardId))
        .to.emit(airdrop, "RewardClaimed")
        .withArgs(account.rewardId, account.address)
        .to.emit(endersGate, "TransferSingle")
        .withArgs(
          airdrop.address,
          ethers.constants.AddressZero,
          account.address,
          reward?.id,
          reward?.amount
        );

      expect(await endersGate.balanceOf(account.address, reward?.id || 0)).to.be.equal(
        reward?.amount
      );
    });

    it("Should only allow to claim once", async () => {
      const {airdrop, testConfig, accounts, endersGate} = await loadFixture(configFixture);
      const account = testConfig.addresses[0];
      const reward = testConfig.rewards.find((rew) => rew.id === account.rewardId);
      const wallet = accounts.find((acc) => acc.address === account.address) as SignerWithAddress;

      await expect(airdrop.connect(wallet).claimReward(account.rewardId))
        .to.emit(airdrop, "RewardClaimed")
        .withArgs(account.rewardId, account.address)
        .to.emit(endersGate, "TransferSingle")
        .withArgs(
          airdrop.address,
          ethers.constants.AddressZero,
          account.address,
          reward?.id,
          reward?.amount
        );
      await expect(airdrop.connect(wallet).claimReward(account.rewardId)).to.be.revertedWith(
        "PacksAirdrop:NOT_ALLOWED"
      );
    });

    it("Should not allow user without reward", async () => {
      const {airdrop, testConfig, accounts, endersGate} = await loadFixture(configFixture);
      const account = testConfig.addresses[0];
      const reward = testConfig.rewards.find((rew) => rew.id === account.rewardId) as any;
      const invalidRewardId = reward.id + 1;
      const wallet = accounts.find((acc) => acc.address === account.address) as SignerWithAddress;
      const isAllowed = await airdrop.isAllowed(invalidRewardId, wallet.address);

      expect(isAllowed).to.be.equal(false);
      await expect(airdrop.connect(wallet).claimReward(invalidRewardId)).to.be.revertedWith(
        "PacksAirdrop:NOT_ALLOWED"
      );
    });
  });

  describe("Production config", () => {
    it("Should create correct rewards", async () => {
      const {airdrop, config} = await loadFixture(productionConfigFixture);

      for (let reward of config) {
        const actualReward = await airdrop.reward(reward.id);
        expect(actualReward.tokenId).to.be.equal(reward.tokenId);
        expect(actualReward.token).to.be.equal(reward.token);
        expect(actualReward.amount).to.be.equal(reward.amount);
      }
    });

    it("Should whitelist correct wallets", async () => {
      const {airdrop, config} = await loadFixture(productionConfigFixture);

      for (let reward of config) {
        for (let user of reward.addresses) {
          expect(await airdrop.isAllowed(reward.id, user), "User not granted access").to.be.equal(
            true
          );
        }
      }
    });
  });
});
