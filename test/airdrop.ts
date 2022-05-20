import {expect} from "chai";
import hre, {waffle, ethers} from "hardhat";
const {loadFixture} = waffle;

import {loadJsonFile} from "../utils";
import {deploy} from "../utils/contracts";
import {configureAirdrop, getAirdropConfig, Reward} from "../utils/airdrop";
import {EndersGate, EndersPack, PacksAirdrop} from "../types";

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
    const library = await (await ethers.getContractFactory("LootBoxRandomness")).deploy();
    const packs = <EndersPack>await (
      await ethers.getContractFactory("EndersPack", {
        libraries: {LootBoxRandomness: library.address},
      })
    ).deploy(
      "Enders Gate",
      "GATE",
      ethers.utils.id(Math.random().toString()),
      "https://ipfs.io/ipfs/"
    );
    const airdrop = <PacksAirdrop>await deploy(hre, "PacksAirdrop", accounts[0], []);
    const {config, contractBalance} = getAirdropConfig(hre, endersGate, packs);
    await packs.setState(endersGate.address, 5, 5, 5);

    return {
      user: accounts[0],
      accounts,
      endersGate,
      packs,
      airdrop,
      config,
      contractBalance,
    };
  };

  const configFixture = async () => {
    const {user, endersGate, packs, airdrop, ...rest} = await noConfigFixture();
    const configuration = getAirdropConfig(hre, endersGate, packs);
    const testConfig = {
      account: user.address,
      rewards: [
        {
          token: endersGate.address,
          tokenId: 231,
          amount: 4,
        },
        {
          token: packs.address,
          tokenId: 2,
          amount: 2,
        },
      ],
    };
    configuration.config.push(testConfig);

    await configureAirdrop(hre, configuration, airdrop, endersGate, packs);

    return {
      ...rest,
      user,
      endersGate,
      packs,
      airdrop,
      testConfig,
    };
  };

  const productionFixture = async () => {
    const {user, endersGate, packs, airdrop, ...rest} = await noConfigFixture();
    const configuration = getAirdropConfig(hre, endersGate, packs);
    await configureAirdrop(hre, configuration, airdrop, endersGate, packs);

    return {
      ...rest,
      user,
      endersGate,
      packs,
      airdrop,
    };
  };

  describe("Initialization", () => {
    it("Should initialize roles", async () => {
      const {user, accounts, airdrop} = await loadFixture(noConfigFixture);
      expect(await airdrop.hasRole(await airdrop.DEFAULT_ADMIN_ROLE(), user.address)).to.be.equal(
        true
      );
      expect(await airdrop.hasRole(await airdrop.REWARD_MANAGER(), user.address)).to.be.equal(true);
      expect(await airdrop.hasRole(await airdrop.WITHDRAWER(), user.address)).to.be.equal(true);
    });

    it("Should allow owner to set rewards", async () => {
      const {airdrop, config} = await loadFixture(noConfigFixture);
      const wallets = config.map(({account}) => account);
      const amounts = config.map(({rewards}) => rewards.map(({amount}) => amount));
      const ids = config.map(({rewards}) => rewards.map(({tokenId}) => tokenId));
      const tokens = config.map(({rewards}) => rewards.map(({token}) => token));

      await expect(airdrop.setReward([wallets[0]], [amounts[0]], [ids[0]], [tokens[0]]))
        .to.emit(airdrop, "RewardChanged")
        .withArgs(wallets[0], tokens[0], amounts[0], ids[0]);

      const rewards = await airdrop.getRewards(wallets[0]);
      for (let i = 0; i < rewards.length; i++) {
        expect(rewards[0].token).to.be.equal(tokens[0][i]);
        expect(rewards[0].amount).to.be.equal(amounts[0][i]);
        expect(rewards[0].tokenId).to.be.equal(ids[0][i]);
      }
    });

    it("Should only allow owner to set addresses", async () => {
      const {config, airdrop, accounts} = await loadFixture(noConfigFixture);
      const wallets = config.map(({account}) => account);
      const amounts = config.map(({rewards}) => rewards.map(({amount}) => amount));
      const ids = config.map(({rewards}) => rewards.map(({tokenId}) => tokenId));
      const tokens = config.map(({rewards}) => rewards.map(({token}) => token));
      await expect(
        airdrop.connect(accounts[1]).setReward([wallets[0]], [amounts[0]], [ids[0]], [tokens[0]])
      ).to.be.revertedWith("");
    });
  });

  describe("airdrop claim", () => {
    it("Should allow users to claim their reward", async () => {
      const {airdrop, accounts, endersGate, packs, testConfig, user} = await loadFixture(
        configFixture
      );
      const endersReward = testConfig.rewards.find(
        ({token}) => token === endersGate.address
      ) as Reward;
      const packReward = testConfig.rewards.find(({token}) => token === packs.address) as Reward;
      const [endersPrevBal, packsPrevBal] = await Promise.all([
        endersGate.balanceOf(user.address, endersReward.tokenId),
        packs.balanceOf(user.address, packReward.tokenId),
      ]);

      expect(endersPrevBal).to.equal(0);
      expect(packsPrevBal).to.equal(0);
      await expect(airdrop.claimReward()).to.emit(airdrop, "RewardClaimed");

      const [endersPostBal, packsPostBal] = await Promise.all([
        endersGate.balanceOf(user.address, endersReward.tokenId),
        packs.balanceOf(user.address, packReward.tokenId),
      ]);
      expect(endersPostBal).to.equal(endersReward.amount);
      expect(packsPostBal).to.equal(packReward.amount);
    });

    it("Should only allow to claim once", async () => {
      const {airdrop} = await loadFixture(configFixture);
      await expect(airdrop.claimReward()).to.emit(airdrop, "RewardClaimed");
      await expect(airdrop.claimReward()).to.be.revertedWith("PacksAirdrop:NOT_ALLOWED");
    });

    it("Should not allow user without reward", async () => {
      const {airdrop, accounts} = await loadFixture(configFixture);
      await expect(airdrop.connect(accounts[1]).claimReward()).to.be.revertedWith(
        "PacksAirdrop:NOT_ALLOWED"
      );
    });

    it("Should allow to withdraw leftovers", async () => {
      const {airdrop, endersGate, packs, accounts} = await loadFixture(configFixture);
      const tokenId = 231;

      await expect(airdrop.claimReward()).to.emit(airdrop, "RewardClaimed");

      const contractBalance = await endersGate.balanceOf(airdrop.address, tokenId);
      await expect(airdrop.withdraw(endersGate.address, tokenId, accounts[3].address))
        .to.emit(endersGate, "TransferSingle")
        .withArgs(airdrop.address, airdrop.address, accounts[3].address, tokenId, contractBalance);
    });

    it("Should allow only owner to withdraw leftovers", async () => {
      const {airdrop, endersGate, packs, accounts} = await loadFixture(configFixture);
      const tokenId = 231;

      await expect(
        airdrop.connect(accounts[1]).withdraw(endersGate.address, tokenId, accounts[3].address)
      ).to.be.revertedWith("");
    });
  });

  describe("Production config", () => {
    it("Should create correct rewards", async () => {
      const {airdrop, config} = await loadFixture(productionFixture);
      for (let cur of config) {
        const rewards = await airdrop.getRewards(cur.account);
        //console.log(cur, rewards);
        rewards.forEach(({token, tokenId, amount}, i) => {
          expect(
            cur.rewards.some(
              (rew) =>
                rew.token === token &&
                rew.tokenId === tokenId.toNumber() &&
                rew.amount === amount.toNumber()
            )
          );
        });
      }
    });
  });
});
