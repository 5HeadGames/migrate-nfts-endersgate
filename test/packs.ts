import {ethers, upgrades, network} from "hardhat";
import {BigNumber, BigNumberish} from "@ethersproject/bignumber";
import {expect, assert} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {EndersGate, EndersPack} from "../types";
import {getPacksConfig} from "../utils/packs";

const hash = ethers.utils.id(Math.random().toString());
const URI = "https://some/url/";

describe.only("Packs ERC1155", function () {
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
      await pack.setState(endersGate.address, packsConfig.NUM_CARDS, packsConfig.NUM_TYPES, 5);
    });

    it("Should set class for each card", async () => {
      for await (let i of packsConfig.cards) {
        await pack.setOptionSettings(
          i.id,
          i.mintLimit,
          i.types.map(({id}) => id),
          i.types.map(({inferiorLimit}) => inferiorLimit),
          i.types.map(({superiorLimit}) => superiorLimit)
        );
      }
      const testCard = packsConfig.cards[0];
      await expect(
        pack.connect(accounts[1]).setOptionSettings(
          testCard.id,
          testCard.mintLimit,
          testCard.types.map(({id}) => id),
          testCard.types.map(({inferiorLimit}) => inferiorLimit),
          testCard.types.map(({superiorLimit}) => superiorLimit)
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
        amount = 10;
      const receipt = await (await pack.unpack(option, accounts[0].address, amount)).wait();
      const {types, sent} = packsConfig.getCountsInReceipt(receipt, endersGate);
      const actualBalance = await endersGate.balanceOfBatch(
        sent.map(() => accounts[0].address),
        sent.map(({id}) => id)
      );
      const mintAmount = actualBalance.reduce((acc, cur) => acc + cur.toNumber(), 0);

      console.log(types)
      expect(mintAmount, 'Incorrect mint amount').to.be.equal(amount * 5)
      expect(
        Object.values(types).reduce((acc, cur) => acc + cur, 0),
        "Mint amount mismatch"
      ).to.be.equal(mintAmount);
    });

    it("RARE_PACK", async () => {});

    it("EPIC_PACK", async () => {});

    it("LEGENDARY_PACK", async () => {});
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

      await expect(pack.connect(accounts[1]).setIpfsHashBatch(ids, hashes)).to.revertedWith(
        ""
      );
      await expect(pack.setIpfsHashBatch(ids, hashes)).to.not.revertedWith("");
      expect(await pack.uri(ids[0])).to.be.equal(URI + hashes[0]);
    });
  });
});