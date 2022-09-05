import {ethers, waffle, network} from "hardhat";
import {getContractAddress} from "@ethersproject/address";
import {expect, assert} from "chai";

import {packsConfigFixture} from "./fixtures/packs";

const {loadFixture} = waffle;
const TEST_AMOUNT = 30;
let accountCount = 3;

describe("Packs ERC1155", function () {
  describe("Unpack nfts", () => {
    it("COMMON_PACK: individual quantities", async () => {
      const {packsConfig, accounts, endersGate, packs} = await loadFixture(packsConfigFixture);
      const option = packsConfig.COMMON_ID,
        amount = TEST_AMOUNT,
        card = packsConfig.getCard(packsConfig.COMMON_ID);

      for (let i = 0; i < amount; i++) {
        const account = accounts[accountCount++];
        await packs.mintBatch(account.address, [option], [amount], []);
        const receipt = await (await packs.connect(account).unpack(option, 1)).wait();

        const {types, sent, typesByID} = packsConfig.getCountsInReceipt(receipt, endersGate);
        const actualBalance = await endersGate.balanceOfBatch(
          sent.map(() => account.address),
          sent.map(({id}) => id)
        );

        const mintCorrectly = sent.every(({amount}, i) => amount === actualBalance[i].toNumber());
        const guaranteed = card.types.every((typ) => typ.inferiorLimit <= (typesByID[typ.id] || 0));
        const superiorLimit = card.types.every(
          (typ) => typ.superiorLimit >= (typesByID[typ.id] || 0)
        );

        if (!mintCorrectly || !guaranteed || !superiorLimit) {
          console.log(types, sent, actualBalance, {
            mintCorrectly,
            guaranteed,
            superiorLimit,
          });
        }
        assert(mintCorrectly, "Mint correctly");
        assert(guaranteed, "Not guaranteed");
        assert(superiorLimit, "Superior limit");
      }
    });

    it("COMMON_PACK: overall quantities", async () => {
      const {packsConfig, accounts, endersGate, packs} = await loadFixture(packsConfigFixture);
      const account = accounts[accountCount++];
      const option = packsConfig.COMMON_ID,
        amount = TEST_AMOUNT;
      await packs.mintBatch(account.address, [option], [amount], []);
      const receipt = await (await packs.connect(account).unpack(option, amount)).wait();

      const {types, sent, typesByID} = packsConfig.getCountsInReceipt(receipt, endersGate);
      const actualBalance = await endersGate.balanceOfBatch(
        sent.map(() => account.address),
        sent.map(({id}) => id)
      );
      const mintAmount = actualBalance.reduce((acc, cur) => acc + cur.toNumber(), 0);

      expect(mintAmount, "Incorrect mint amount").to.be.equal(amount * 5);
      expect(
        Object.values(types).reduce((acc, cur) => acc + cur, 0),
        "Mint amount mismatch"
      ).to.be.equal(mintAmount);
    });

    it("RARE_PACK:individual quantities", async () => {
      const {packsConfig, accounts, endersGate, packs} = await loadFixture(packsConfigFixture);
      const option = packsConfig.RARE_ID,
        amount = TEST_AMOUNT,
        card = packsConfig.getCard(packsConfig.RARE_ID);

      for (let i = 0; i < amount; i++) {
        const account = accounts[accountCount++];
        await packs.mintBatch(account.address, [option], [amount], []);
        const receipt = await (await packs.connect(account).unpack(option, 1)).wait();

        const {types, sent, typesByID} = packsConfig.getCountsInReceipt(receipt, endersGate);
        const actualBalance = await endersGate.balanceOfBatch(
          sent.map(() => account.address),
          sent.map(({id}) => id)
        );

        const mintCorrectly = sent.every(({amount}, i) => amount === actualBalance[i].toNumber());
        const guaranteed = card.types.every((typ) => typ.inferiorLimit <= (typesByID[typ.id] || 0));
        const superiorLimit = card.types.every(
          (typ) => typ.superiorLimit >= (typesByID[typ.id] || 0)
        );

        if (!mintCorrectly || !guaranteed || !superiorLimit) {
          console.log(types, sent, actualBalance, {
            mintCorrectly,
            guaranteed,
            superiorLimit,
          });
          throw new Error("yikes");
        }
        assert(mintCorrectly, "Mint correctly");
        assert(guaranteed, "Not guaranteed");
        assert(superiorLimit, "Superior limit");
      }
    });

    it("RARE_PACK: overall quantities", async () => {
      const {packsConfig, accounts, endersGate, packs} = await loadFixture(packsConfigFixture);
      const account = accounts[accountCount++];
      const option = packsConfig.RARE_ID,
        amount = TEST_AMOUNT;

      await packs.mintBatch(account.address, [option], [amount], []);
      const receipt = await (await packs.connect(account).unpack(option, amount)).wait();

      const {types, sent} = packsConfig.getCountsInReceipt(receipt, endersGate);
      const actualBalance = await endersGate.balanceOfBatch(
        sent.map(() => account.address),
        sent.map(({id}) => id)
      );
      const mintAmount = actualBalance.reduce((acc, cur) => acc + cur.toNumber(), 0);

      expect(mintAmount, "Incorrect mint amount").to.be.equal(amount * 5);
      expect(
        Object.values(types).reduce((acc, cur) => acc + cur, 0),
        "Mint amount mismatch"
      ).to.be.equal(mintAmount);
    });

    it("EPIC_PACK:individual quantities", async () => {
      const {packsConfig, accounts, endersGate, packs} = await loadFixture(packsConfigFixture);
      const option = packsConfig.EPIC_ID,
        amount = TEST_AMOUNT,
        card = packsConfig.getCard(packsConfig.EPIC_ID);

      for (let i = 0; i < amount; i++) {
        const account = accounts[accountCount++];
        await packs.mintBatch(account.address, [option], [amount], []);
        const receipt = await (await packs.connect(account).unpack(option, 1)).wait();

        const {types, sent, typesByID} = packsConfig.getCountsInReceipt(receipt, endersGate);
        const actualBalance = await endersGate.balanceOfBatch(
          sent.map(() => account.address),
          sent.map(({id}) => id)
        );

        const mintCorrectly = sent.every(({amount}, i) => amount === actualBalance[i].toNumber());
        const guaranteed = card.types.every((typ) => typ.inferiorLimit <= (typesByID[typ.id] || 0));
        const superiorLimit = card.types.every(
          (typ) => typ.superiorLimit >= (typesByID[typ.id] || 0)
        );

        if (!mintCorrectly || !guaranteed || !superiorLimit) {
          console.log(types, sent, actualBalance, {
            mintCorrectly,
            guaranteed,
            superiorLimit,
          });
          throw new Error("yikes");
        }
        assert(mintCorrectly, "Mint correctly");
        assert(guaranteed, "Not guaranteed");
        assert(superiorLimit, "Superior limit");
      }
    });

    it("EPIC_PACK: overall quantities", async () => {
      const {packsConfig, accounts, endersGate, packs} = await loadFixture(packsConfigFixture);
      const account = accounts[accountCount++];
      const option = packsConfig.EPIC_ID,
        amount = TEST_AMOUNT;
      await packs.mintBatch(account.address, [option], [amount], []);
      const receipt = await (await packs.connect(account).unpack(option, amount)).wait();

      const {types, sent} = packsConfig.getCountsInReceipt(receipt, endersGate);
      const actualBalance = await endersGate.balanceOfBatch(
        sent.map(() => account.address),
        sent.map(({id}) => id)
      );
      const mintAmount = actualBalance.reduce((acc, cur) => acc + cur.toNumber(), 0);

      expect(mintAmount, "Incorrect mint amount").to.be.equal(amount * 5);
      expect(
        Object.values(types).reduce((acc, cur) => acc + cur, 0),
        "Mint amount mismatch"
      ).to.be.equal(mintAmount);
    });

    it("LEGENDARY_PACK:individual quantities", async () => {
      const {packsConfig, accounts, endersGate, packs} = await loadFixture(packsConfigFixture);
      const option = packsConfig.LEGENDARY_ID,
        amount = TEST_AMOUNT,
        card = packsConfig.getCard(packsConfig.LEGENDARY_ID);

      for (let i = 0; i < amount; i++) {
        const account = accounts[accountCount++];
        await packs.mintBatch(account.address, [option], [amount], []);
        const receipt = await (await packs.connect(account).unpack(option, 1)).wait();

        const {types, sent, typesByID} = packsConfig.getCountsInReceipt(receipt, endersGate);
        const actualBalance = await endersGate.balanceOfBatch(
          sent.map(() => account.address),
          sent.map(({id}) => id)
        );

        const mintCorrectly = sent.every(({amount}, i) => amount === actualBalance[i].toNumber());
        const guaranteed = card.types.every((typ) => typ.inferiorLimit <= (typesByID[typ.id] || 0));
        const superiorLimit = card.types.every(
          (typ) => typ.superiorLimit >= (typesByID[typ.id] || 0)
        );

        if (!mintCorrectly || !guaranteed || !superiorLimit) {
          console.log(types, sent, actualBalance, {
            mintCorrectly,
            guaranteed,
            superiorLimit,
          });
          throw new Error("yikes");
        }
        assert(mintCorrectly, "Mint correctly");
        assert(guaranteed, "Not guaranteed");
        assert(superiorLimit, "Superior limit");
      }
    });

    it("LEGENDARY_PACK: overall quantities", async () => {
      const {packsConfig, accounts, endersGate, packs} = await loadFixture(packsConfigFixture);
      const account = accounts[accountCount++];
      const option = packsConfig.LEGENDARY_ID,
        amount = TEST_AMOUNT;
      await packs.mintBatch(account.address, [option], [amount], []);
      const receipt = await (await packs.connect(account).unpack(option, amount)).wait();

      const {types, sent} = packsConfig.getCountsInReceipt(receipt, endersGate);
      const actualBalance = await endersGate.balanceOfBatch(
        sent.map(() => account.address),
        sent.map(({id}) => id)
      );
      const mintAmount = actualBalance.reduce((acc, cur) => acc + cur.toNumber(), 0);

      expect(mintAmount, "Incorrect mint amount").to.be.equal(amount * 5);
      expect(
        Object.values(types).reduce((acc, cur) => acc + cur, 0),
        "Mint amount mismatch"
      ).to.be.equal(mintAmount);
    });

    it("Should never mint eross and dracul", async () => {
      const {packsConfig, accounts, endersGate} = await loadFixture(packsConfigFixture);
      const forbiddenIds = packsConfig
        .getAllNfts()
        .filter(({name}) => name === "Eross" || name === "Dracul");

      for (let i = 0; i < forbiddenIds.length; i++) {
        const balances = await endersGate.balanceOfBatch(
          accounts.map(({address}) => address),
          accounts.map(() => forbiddenIds[i].properties.id.value)
        );
        for (let j = 0; j < balances.length; j++) expect(balances[j]).to.be.equal(0);
      }
    });
  });

  describe("URI settings and minting/burning", async () => {
    it("Should set uri for only setter role", async () => {
      const {accounts, packs, URI} = await loadFixture(packsConfigFixture);
      await packs.setURI(URI);
      await expect(packs.connect(accounts[1]).setURI("SOME FALCE URI")).to.revertedWith("");
      expect(await packs.baseURI(), "URI Not set properly").to.be.equal(URI);
    });

    it("Should set ipfs only setter role", async () => {
      const {accounts, packs, URI} = await loadFixture(packsConfigFixture);
      const ids = [1];
      const hashes = [ethers.utils.id(Math.random().toString())];

      await expect(packs.connect(accounts[1]).setIpfsHashBatch(ids, hashes)).to.revertedWith("");
      await expect(packs.setIpfsHashBatch(ids, hashes)).to.not.revertedWith("");
      expect(await packs.uri(ids[0])).to.be.equal(URI + hashes[0]);
    });

    it("Only owner should mint packs normally", async () => {
      const {packsConfig, accounts, packs} = await loadFixture(packsConfigFixture);
      const mintId = packsConfig.COMMON_ID;
      await packs.mint(accounts[0].address, mintId, []);

      await expect(
        packs.connect(accounts[1]).mint(accounts[0].address, mintId, [])
      ).to.revertedWith("");
      expect(await packs.balanceOf(accounts[0].address, mintId)).to.be.equal("1");
    });

    it("Only owner should mint batch packs normally", async () => {
      const {packsConfig, accounts, packs} = await loadFixture(packsConfigFixture);
      const mintIds = [packsConfig.RARE_ID, packsConfig.EPIC_ID, packsConfig.LEGENDARY_ID],
        amounts = mintIds.map(() => 100);
      await packs.mintBatch(accounts[0].address, mintIds, amounts, []);
      const balances = await packs.balanceOfBatch(
        mintIds.map(() => accounts[0].address),
        mintIds
      );

      await expect(
        packs.connect(accounts[1]).mintBatch(accounts[0].address, [mintIds], [amounts], [])
      ).to.revertedWith("");
      assert(
        balances.every((bal, i) => bal.toString() === amounts[i].toString()),
        "Wrong balances"
      );
    });

    it("Only owner should burn packs normally from other addresses", async () => {
      const {packsConfig, accounts, packs} = await loadFixture(packsConfigFixture);
      const mintId = packsConfig.COMMON_ID;
      await packs.mint(accounts[1].address, mintId, []);
      expect(await packs.balanceOf(accounts[1].address, mintId)).to.be.equal("1");

      await packs.burnFor(accounts[1].address, mintId);

      await expect(
        packs.connect(accounts[1]).burnFor(accounts[1].address, mintId)
      ).to.be.revertedWith("");
      expect(await packs.balanceOf(accounts[1].address, mintId)).to.be.equal("0");
    });

    it("Only owner should burn batch packs normally from other addresses", async () => {
      const {packsConfig, accounts, packs} = await loadFixture(packsConfigFixture);
      const mintIds = [packsConfig.RARE_ID, packsConfig.EPIC_ID, packsConfig.LEGENDARY_ID],
        amounts = mintIds.map(() => 100);
      await packs.mintBatch(accounts[1].address, mintIds, amounts, []);

      await packs.burnBatchFor(accounts[1].address, mintIds, amounts);
      await expect(
        packs.connect(accounts[1]).burnBatchFor(accounts[1].address, mintIds, amounts)
      ).to.be.revertedWith("");

      const balances = await packs.balanceOfBatch(
        mintIds.map(() => accounts[1].address),
        mintIds
      );
      assert(
        balances.every((bal, i) => bal.toString() === "0"),
        "Wrong balances"
      );
    });
  });

  describe("Packs should emmit correct events", async () => {
    it("Should have fired the unpack event on this block", async () => {
      const {accounts, packs, packsConfig, endersGate} = await loadFixture(packsConfigFixture);

      await network.provider.send("evm_mine");

      const account = accounts[accountCount++];
      const option = packsConfig.COMMON_ID,
        amount = 10;
      await packs.mintBatch(account.address, [option], [amount], []);
      const currentBlock = await ethers.provider.getBlockNumber();

      await (await packs.connect(account).unpack(option, amount)).wait();

      const packLogs = (
        await ethers.provider.getLogs({address: packs.address, fromBlock: currentBlock})
      ).map((ev) => packs.interface.parseLog(ev));
      const nftLogs = (
        await ethers.provider.getLogs({address: endersGate.address, fromBlock: currentBlock})
      ).map((ev) => endersGate.interface.parseLog(ev));

      expect(packLogs.filter(({name}) => name === "LootBoxOpened").length).to.be.equal(amount);
      expect(nftLogs.filter(({name}) => name === "TransferSingle").length).to.be.equal(
        amount * 5
      );
    });
  });

  describe("Security checks", async () => {
    it("Should not allow contracts to unpack", async () => {
      const {accounts, packs, packsConfig} = await loadFixture(packsConfigFixture);
      const amount = 10;
      const ID = packsConfig.COMMON_ID;
      const accountContract = await (await ethers.getContractFactory("Account")).deploy();

      const signature = packs.interface.encodeFunctionData("unpack", [ID, amount]);

      await packs.mintBatch(accountContract.address, [ID], [amount], []);
      await expect(accountContract.execute([packs.address], [0], [signature])).to.be.revertedWith(
        ""
      );
    });

    it("Should not allow contracts to unpack from constructor", async () => {
      const {accounts, packs, packsConfig} = await loadFixture(packsConfigFixture);
      const amount = 10;
      const ID = packsConfig.COMMON_ID;
      const signature = packs.interface.encodeFunctionData("unpack", [ID, amount]);
      const nonce = await accounts[0].getTransactionCount();

      const futureAddress = getContractAddress({
        from: accounts[0].address,
        nonce,
      });

      await packs.mintBatch(futureAddress, [ID], [amount], []);
      await expect(
        (
          await ethers.getContractFactory("AccountConstructor")
        ).deploy([packs.address], [0], [signature]),
        "Not unpack"
      ).to.be.revertedWith("");
    });
  });
});
