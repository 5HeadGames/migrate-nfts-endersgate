import {ethers, upgrades, network} from "hardhat";
import {BigNumber, BigNumberish} from "@ethersproject/bignumber";
import {expect, assert} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {EndersGate, EndersPack} from "../types";
import {getPacksConfig} from "../utils/packs";

const hash = ethers.utils.id(Math.random().toString());
const URI = "https://some/url/";

describe("Packs ERC1155", function () {
  let endersGate: EndersGate, accounts: SignerWithAddress[], pack: EndersPack;
  const packsConfig = getPacksConfig();

  describe("Configuration", () => {
    it("Should deploy properly", async () => {
      const library = await (await ethers.getContractFactory("LootBoxRandomness")).deploy();

      accounts = await ethers.getSigners();
      endersGate = (await (
        await ethers.getContractFactory("EndersGate")
      ).deploy("Enders Gate", "GATE", hash, "https://ipfs.io/ipfs/")) as EndersGate;
      pack = await (
        await ethers.getContractFactory("EndersPack", {
          libraries: {
            LootBoxRandomness: library.address,
          },
        })
      ).deploy("Enders Gate Pack", "PACK", URI, "https://ipfs.io/ipfs/");

      await endersGate.grantRole(await endersGate.MINTER_ROLE(), pack.address);
      await endersGate.mintBatch(pack.address, [0, 1, 2], [100, 100, 100], ["", "", ""]);
      await pack.setState(
        endersGate.address,
        packsConfig.NUM_CARDS,
        packsConfig.NUM_CLASSES,
        packsConfig.NUM_TYPES,
        5
      );
    });

    it("Should set class for each card", async () => {
      for await (let i of packsConfig.cards) {
        const classes = i.classes.map(({id}) => packsConfig.getClass(id));
        await pack.setOptionSettings(
          i.id,
          classes.map(({id}) => id),
          classes.map(({probability}) => probability)
        );
      }
      const testCard = packsConfig.cards[0];
      const testClass = testCard.classes.map(({id}) => packsConfig.getClass(id));
      await expect(
        pack.connect(accounts[1]).setOptionSettings(
          testCard.id,
          testClass.map(({id}) => id),
          testClass.map(({probability}) => probability)
        )
      ).to.be.revertedWith("");
    });

    it("Should set type for each class", async () => {
      for await (let i of packsConfig.classes) {
        await pack.setTokenTypeForClass(
          i.id,
          i.types.map(({id}) => id),
          i.types.map(({amount}) => amount)
        );
      }
      const testClass = packsConfig.classes[0];
      await expect(
        pack.connect(accounts[1]).setTokenTypeForClass(
          testClass.id,
          testClass.types.map(({id}) => id),
          testClass.types.map(({amount}) => amount)
        )
      ).to.be.revertedWith("");
    });

    it("Should set tokens for each type", async () => {
      for await (let i of packsConfig.types) await pack.setTokensForTypes(i.id, i.nftsIds);
      const testType = packsConfig.types[0];
      await expect(
        pack.connect(accounts[1]).setTokensForTypes(testType.id, testType.nftsIds)
      ).to.be.revertedWith("");
    });

    it("Only owner should mint packs normally", async () => {
      const mintId = packsConfig.COMMON_ID,
        amount = "100";
      await pack.mint(accounts[0].address, mintId, amount, []);

      await expect(
        pack.connect(accounts[1]).mint(accounts[0].address, mintId, amount, [])
      ).to.revertedWith("");
      expect(await pack.balanceOf(accounts[0].address, mintId)).to.be.equal(amount);
    });

    it("Only owner should mint batch packs normally", async () => {
      const mintIds = [packsConfig.RARE_ID, packsConfig.EPIC_ID, packsConfig.LEGENDARY_ID],
        amounts = mintIds.map(() => 100);
      await pack.mintBatch(accounts[0].address, mintIds, amounts, []);
      const balances = await pack.balanceOfBatch(
        mintIds.map(() => accounts[0].address),
        mintIds
      );

      await expect(
        pack.connect(accounts[1]).mint(accounts[0].address, mintIds, amounts, [])
      ).to.revertedWith("");
      assert(
        balances.every((bal, i) => bal.toString() === amounts[i].toString()),
        "Wrong balances"
      );
    });
  });

  describe("Unpack nfts", () => {
    const errorMargin = 1000; // 10%%
    const isWithinMargin = (amount: number, realAmount: number) => {
      const lowerBound = amount - (amount / 1000) * errorMargin;
      const upperBound = amount + (amount / 1000) * errorMargin;
      return lowerBound < realAmount && upperBound > realAmount;
    };

    it("COMMON_PACK", async () => {
      const option = packsConfig.COMMON_ID,
        amount = 50;
      const receipt = await (await pack.unpack(option, accounts[0].address, amount)).wait();
      const {types, sent} = packsConfig.getCountsInReceipt(receipt, endersGate);
      const actualBalance = await endersGate.balanceOfBatch(
        sent.map(() => accounts[0].address),
        sent.map(({id}) => id)
      );
      const averageMinted = packsConfig.getAverageMintedOfCard({
        cardId: packsConfig.COMMON_ID,
        amountMinted: amount * 5,
      });

      assert(
        actualBalance.every((bal, i) => bal.toNumber() === sent[i].amount),
        "Actual balance mismatch"
      );
      assert(
        sent.every(({to}: any) => to === accounts[0].address),
        "Not sent to pack owner"
      );
      assert(
        Object.keys(types).every((type) => Number(type) === 1 || Number(type) === 0),
        "Not sent other type than 0 or 1"
      );
      assert(isWithinMargin(averageMinted[0], types[0]), "Wood batch minted incorrectly");
      assert(isWithinMargin(averageMinted[1], types[1]), "Stone batch minted incorrectly");
      expect(
        Object.values(types).reduce((acc, cur) => acc + cur, 0),
        "Not guaranteed to be 5 nfts/pack"
      ).to.be.equal(amount * 5);
    });

    it("RARE_PACK", async () => {
      const option = packsConfig.RARE_ID,
        amount = 50,
        receiver = accounts[1].address;
      const receipt = await (await pack.unpack(option, receiver, amount)).wait();
      const {types, sent} = packsConfig.getCountsInReceipt(receipt, endersGate);
      const actualBalance = await endersGate.balanceOfBatch(
        sent.map(() => receiver),
        sent.map(({id}) => id)
      );
      const typesOfCard = packsConfig.getTypesOfCard(option);
      const averageMinted = packsConfig.getAverageMintedOfCard({
        cardId: packsConfig.RARE_ID,
        amountMinted: amount * 5,
      });

      assert(
        actualBalance.every((bal, i) => bal.toNumber() === sent[i].amount),
        "Actual balance mismatch"
      );
      assert(
        sent.every(({to}: any) => to === receiver),
        "Not sent to pack owner"
      );
      assert(
        Object.keys(types).every((type) => typesOfCard[Number(type)] === 1),
        "Not sent other type than allowed"
      );
      assert(isWithinMargin(averageMinted[0], types[0]), "Wood batch minted incorrectly");
      assert(isWithinMargin(averageMinted[1], types[1]), "Stone batch minted incorrectly");
      assert(isWithinMargin(averageMinted[2], types[2]), "Gold batch minted incorrectly");
      expect(
        Object.values(types).reduce((acc, cur) => acc + cur, 0),
        "Not guaranteed to be 5 nfts/pack"
      ).to.be.equal(amount * 5);
    });

    it("EPIC_PACK", async () => {
      const option = packsConfig.EPIC_ID,
        amount = 50,
        receiver = accounts[2].address;
      const receipt = await (await pack.unpack(option, receiver, amount)).wait();
      const {types, sent} = packsConfig.getCountsInReceipt(receipt, endersGate);
      const actualBalance = await endersGate.balanceOfBatch(
        sent.map(() => receiver),
        sent.map(({id}) => id)
      );
      const typesOfCard = packsConfig.getTypesOfCard(option);
      const averageMinted = packsConfig.getAverageMintedOfCard({
        cardId: packsConfig.EPIC_ID,
        amountMinted: amount * 5,
      });

      assert(
        actualBalance.every((bal, i) => bal.toNumber() === sent[i].amount),
        "Actual balance mismatch"
      );
      assert(
        sent.every(({to}: any) => to === receiver),
        "Not sent to pack owner"
      );
      assert(
        Object.keys(types).every((type) => typesOfCard[Number(type)] === 1),
        "Not sent other type than allowed"
      );
      assert(isWithinMargin(averageMinted[1], types[1]), "Stone batch minted incorrectly");
      assert(isWithinMargin(averageMinted[2], types[2]), "Gold batch minted incorrectly");
      assert(isWithinMargin(averageMinted[3], types[3]), "Legendary batch minted incorrectly");
      expect(
        Object.values(types).reduce((acc, cur) => acc + cur, 0),
        "Not guaranteed to be 5 nfts/pack"
      ).to.be.equal(amount * 5);
    });

    it("LEGENDARY_PACK", async () => {
      const option = packsConfig.LEGENDARY_ID,
        amount = 50,
        receiver = accounts[3].address;
      const receipt = await (await pack.unpack(option, receiver, amount)).wait();
      const {types, sent} = packsConfig.getCountsInReceipt(receipt, endersGate);
      const actualBalance = await endersGate.balanceOfBatch(
        sent.map(() => receiver),
        sent.map(({id}) => id)
      );
      const typesOfCard = packsConfig.getTypesOfCard(option);
      const averageMinted = packsConfig.getAverageMintedOfCard({
        cardId: packsConfig.LEGENDARY_ID,
        amountMinted: amount * 5,
      });

      assert(
        actualBalance.every((bal, i) => bal.toNumber() === sent[i].amount),
        "Actual balance mismatch"
      );
      assert(
        sent.every(({to}: any) => to === receiver),
        "Not sent to pack owner"
      );
      assert(
        Object.keys(types).every((type) => typesOfCard[Number(type)] === 1),
        "Not sent other type than allowed"
      );
      assert(isWithinMargin(averageMinted[2], types[2]), "Gold batch minted incorrectly");
      assert(isWithinMargin(averageMinted[3], types[3]), "Legendary batch minted incorrectly");
      expect(
        Object.values(types).reduce((acc, cur) => acc + cur, 0),
        "Not guaranteed to be 5 nfts/pack"
      ).to.be.equal(amount * 5);
    });
  });

  describe("URI settings and minting", async () => {
    it("Should set uri for only setter role", async () => {
      await pack.setURI(URI);
      await expect(pack.connect(accounts[1]).setURI("SOME FALCE URI")).to.revertedWith("");
      expect(await pack.tokenURIPrefix(), "URI Not set properly").to.be.equal(URI);
    });

    it("Should set ipfs only setter role", async () => {
      const ids = [1];
      const hashes = [ethers.utils.id(Math.random().toString())];

      await expect(
        pack.connect(accounts[1]).setIpfsHashBatch(ids, hashes)
      ).to.revertedWith("");
      await expect(pack.setIpfsHashBatch(ids, hashes)).to.not.revertedWith("");
      expect(await pack.uri(ids[0])).to.be.equal(URI + hashes[0]);
    });
  });
});
