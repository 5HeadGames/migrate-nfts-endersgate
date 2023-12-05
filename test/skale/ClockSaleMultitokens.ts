import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Block } from "@ethersproject/abstract-provider";

import { getLogs } from "../../utils";
import { ClockSaleOnlyMultiTokens, EndersGate, MockERC20 } from "../../types";

const SALE_STATUS = {
  created: 0,
  successful: 1,
  cancel: 2,
};

const parseSale = (
  sale: [
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber[],
    BigNumber,
    number,
    number,
  ],
) => {
  return {
    seller: sale[0],
    nft: sale[1],
    nftId: sale[2],
    amount: sale[3],
    price: sale[4],
    tokens: sale[5],
    duration: sale[6],
    startedAt: sale[7],
    status: sale[8],
  };
};

describe("ClockSale MultiTokens Testing", function () {
  let accounts: SignerWithAddress[],
    marketplace: ClockSaleOnlyMultiTokens,
    nft: EndersGate,
    genesisBlock: number,
    token: MockERC20;
  const feeReceiver = ethers.Wallet.createRandom();

  const salesData = [
    {
      id: 0,
      price: 35000000,
      amount: 10,
      duration: 3600 * 24,
      tokens: [feeReceiver],
    },
    {
      id: 2,
      price: 35000000,
      amount: 14,
      duration: 3600 * 24 * 7,
      tokens: [feeReceiver],
    },
    {
      id: 3,
      price: 4400000,
      amount: 13,
      duration: 3600 * 24 * 364,
      tokens: [feeReceiver],
    },
  ];
  let sales: number[] = [],
    block: Block;
  const OWNER_CUT = "400";

  before(async () => {
    const [Sale, NftFactory, MockERC20, _accounts] = await Promise.all([
      ethers.getContractFactory("ClockSaleOnlyMultiTokens"),
      ethers.getContractFactory("EndersGate"),
      ethers.getContractFactory("MockERC20"),
      ethers.getSigners(),
    ]);
    const ids = new Array(10).fill(0).map((a, i) => i);
    accounts = _accounts;

    [nft, token] = (await Promise.all([
      NftFactory.deploy("EG", "EG", "", "abc/", {
        receiver: _accounts[0].address,
        feeNumerator: 400,
      }),
      MockERC20.deploy(),
    ])) as [EndersGate, MockERC20];

    marketplace = await Sale.deploy(feeReceiver.address, OWNER_CUT);

    genesisBlock = await ethers.provider.getBlockNumber();

    await token.mint(accounts[0].address, "100000000000000000000");
    await token.mint(accounts[1].address, "100000000000000000000");
    await token
      .connect(accounts[1])
      .approve(marketplace.address, "100000000000000000000");

    await marketplace.addToken(token.address, 8);

    await nft.mintBatch(
      accounts[0].address,
      ids,
      ids.map(() => 100),
      [],
    );
  });

  describe("Configuration initialization", () => {
    it("should initialize owner", async () => {
      const owner = await marketplace.owner();
      expect(owner).to.equal(accounts[0].address);
      await marketplace.transferOwnership(accounts[5].address);
      expect(await marketplace.owner()).to.equal(accounts[5].address);
    });

    it("should initialize fee receiver share properly", async () => {
      const ownerCut = await marketplace.ownerCut();
      expect(ownerCut).to.equal(OWNER_CUT);
    });

    it("should initialize fee receiver properly", async () => {
      const receiver = await marketplace.feeReceiver();
      expect(receiver).to.equal(feeReceiver.address);
    });

    it("should initialize genesis block", async () => {
      const block = await marketplace.genesisBlock();
      expect(block, "not genesis block").to.be.equal(genesisBlock.toString());
    });

    it("Owner should whitelist nfts", async () => {
      await marketplace.connect(accounts[5]).setNftAllowed(nft.address, true);

      expect(
        await marketplace.isAllowed(nft.address),
        "Not allowed properly",
      ).to.be.equal(true);
      await expect(
        marketplace.connect(accounts[1]).setNftAllowed(nft.address, true),
        "Not owner",
      ).to.be.revertedWith("");
    });

    it("Owner should stop marketplace", async () => {
      expect(
        await marketplace.connect(accounts[5]).paused(),
        "Stopped at beggining",
      ).to.be.equal(false);
      await expect(
        marketplace.connect(accounts[5]).restartTrading(),
        "restart when not stopped",
      ).to.be.revertedWith("");
      await expect(
        marketplace.connect(accounts[1]).stopTrading(),
        "not owner should stop trading",
      ).to.be.revertedWith("");

      await marketplace.connect(accounts[5]).stopTrading();

      expect(
        await marketplace.connect(accounts[5]).paused(),
        "should be paused",
      ).to.be.equal(true);
      await expect(
        marketplace.connect(accounts[5]).stopTrading(),
        "trading already stopped",
      ).to.be.revertedWith("");
      await expect(
        marketplace.connect(accounts[1]).restartTrading(),
        "only owner should restart",
      ).to.be.revertedWith("");

      await marketplace.connect(accounts[5]).restartTrading();
      expect(await marketplace.paused(), "should be paused").to.be.equal(false);
    });

    it("Should allow owner to change the fee receiver", async () => {
      const newFeeReceiver = ethers.Wallet.createRandom();
      await marketplace
        .connect(accounts[5])
        .setFeeReceiver(newFeeReceiver.address);

      expect(await marketplace.feeReceiver()).to.be.equal(
        newFeeReceiver.address,
      );
      await expect(
        marketplace.connect(accounts[1]).setFeeReceiver(feeReceiver.address),
      ).to.be.revertedWith("");

      await marketplace
        .connect(accounts[5])
        .setFeeReceiver(feeReceiver.address);
    });

    it("Should allow owner to change the fee", async () => {
      const newOwnerCut = Number(OWNER_CUT) + 100;
      await marketplace.connect(accounts[5]).setOwnerCut(newOwnerCut);

      expect((await marketplace.ownerCut()).toNumber()).to.be.equal(
        newOwnerCut,
      );
      await expect(
        marketplace.connect(accounts[1]).setOwnerCut(OWNER_CUT),
      ).to.be.revertedWith("");

      await marketplace.connect(accounts[5]).setOwnerCut(OWNER_CUT);
    });
  });

  describe("Sale", () => {
    it("Should create an auction", async () => {
      for await (let currentSale of salesData) {
        const { id, price, amount, duration } = currentSale;

        await nft.setApprovalForAll(marketplace.address, true);
        const tx = await (
          await marketplace.createSale(
            nft.address,
            id,
            price,
            [token.address],
            amount,
            duration,
          )
        ).wait();

        const logs = getLogs(marketplace.interface, tx);
        const saleId = logs.find(
          ({ name }: { name: string }) => name === "SaleCreated",
        )?.args[0];
        sales.push(saleId);

        const sale = parseSale(
          (
            await marketplace.getSales([(saleId as BigNumber).toNumber()])
          )[0] as any,
        );
        block = await ethers.provider.getBlock(tx.blockNumber);
        expect(sale.seller).to.be.equal(accounts[0].address);
        expect(sale.nft).to.be.equal(nft.address);
        expect(sale.nftId).to.be.equal(id);
        expect(sale.amount).to.be.equal(amount);
        expect(sale.price).to.be.equal(price);
        expect(sale.duration).to.be.equal(duration);
        //expect(sale.startedAt).to.be.equal(block.timestamp.toString());
      }
    });

    it("Should set correctly the price in USD", async () => {
      for await (let currentSale of salesData) {
        const { id, price, amount, duration } = currentSale;

        await nft.setApprovalForAll(marketplace.address, true);
        const tx = await (
          await marketplace.createSale(
            nft.address,
            id,
            price,
            [token.address],
            amount,
            duration,
          )
        ).wait();

        const logs = getLogs(marketplace.interface, tx);
        const saleId = logs.find(
          ({ name }: { name: string }) => name === "SaleCreated",
        )?.args[0];

        const sale = parseSale(
          (
            await marketplace.getSales([(saleId as BigNumber).toNumber()])
          )[0] as any,
        );

        expect(
          Math.round(
            (await marketplace.getPrice(saleId, sale.tokens[0] as any, 1))
              .div(10 ** 2)
              .toNumber(),
          ),
        ).to.be.equal(price);
      }
    });

    it("Should get batch sales", async () => {
      const allSales = (await marketplace.getSales(sales)).map((sale: any) =>
        parseSale(sale),
      );
      allSales.forEach((sale: any, i: any) => {
        const { id, amount, price, duration } = salesData[i];
        expect(sale.seller).to.be.equal(accounts[0].address);
        expect(sale.nft).to.be.equal(nft.address);
        expect(sale.nftId).to.be.equal(id);
        expect(sale.amount).to.be.equal(amount);
        expect(sale.price).to.be.equal(price);
        expect(sale.tokens[0]).to.be.equal(token.address);
        expect(sale.duration).to.be.equal(duration);
        expect(sale.status).to.be.equal(SALE_STATUS.created);
        //expect(sale.startedAt).to.be.equal(block.timestamp.toString());
      });
    });

    it("Should cancel sales", async () => {
      await expect(
        marketplace.connect(accounts[2]).cancelSale(sales[0]),
        "only owner of sale",
      ).to.be.revertedWith("");

      const prevBalance = await nft.balanceOf(
        accounts[0].address,
        salesData[0].id,
      );
      const logs = getLogs(
        marketplace.interface,
        await (await marketplace.cancelSale(sales[0])).wait(),
      );
      const saleId = logs.find(
        ({ name }: { name: string }) => name === "SaleCancelled",
      )?.args[0];
      const postBalance = await nft.balanceOf(
        accounts[0].address,
        salesData[0].id,
      );
      const [singleSale] = await marketplace.getSales([sales[0]]);

      expect(singleSale.status).to.be.equal(SALE_STATUS.cancel);
      expect(prevBalance.add(salesData[0].amount).toString()).to.be.equal(
        postBalance.toString(),
      );
      expect(saleId, "removed wrong sale id").to.be.equal("0");
    });

    it("Should not buy cancelled sales", async () => {
      await expect(
        marketplace.buy(sales[0], salesData[0].amount, feeReceiver.address),
      ).to.be.revertedWith("");
    });

    it("Should buy sales by given amounts", async () => {
      const amount = 2;
      const cost = await marketplace.getPrice(sales[1], token.address, amount);
      const buyer = accounts[1];
      const [buyerBalance, sellerBalance, feeReceiverBalance] =
        await Promise.all([
          await token.balanceOf(buyer.address),
          await token.balanceOf(accounts[0].address),
          await token.balanceOf(feeReceiver.address),
        ]);
      const receipt = await (
        await marketplace.connect(buyer).buy(sales[1], amount, token.address)
      ).wait();
      const log = getLogs(marketplace.interface, receipt).find(
        ({ name }) => name === "BuySuccessful",
      );
      const [postBuyerBalance, postSellerBalance, postFeeReceiverBalance] =
        await Promise.all([
          await token.balanceOf(buyer.address),
          await token.balanceOf(accounts[0].address),
          await token.balanceOf(feeReceiver.address),
        ]);

      const feeAmount = cost.mul(OWNER_CUT).div(10000);

      expect(
        postFeeReceiverBalance.sub(feeReceiverBalance).toString(),
      ).to.be.equal(feeAmount.toString());

      expect(postSellerBalance.sub(sellerBalance).toString()).to.be.equal(
        cost.sub(feeAmount).toString(),
      );

      expect(buyerBalance.sub(postBuyerBalance)).to.be.equal(cost.toString());
      expect(log?.args[0].toString(), "Wrong sales id").to.be.equal(sales[1]);
      expect(log?.args[1].toString(), "Wrong buyer").to.be.equal(buyer.address); //buyer
      expect(log?.args[2].toString(), "Wrong cost").to.be.equal(
        cost.toString(),
      );
      console.log(log?.args[3].toString());
      expect(log?.args[4].toString(), "Wrong nft amount").to.be.equal(
        String(amount),
      );
    });

    it("Should not buy duration passed sales", async () => {
      const timeSale = {
        id: 2,
        priceUSD: ethers.utils.parseEther("1"),
        amount: 14,
        duration: 3600 * 24 * 7,
        tokens: [token.address],
      };
      await nft.setApprovalForAll(marketplace.address, true);
      const tx = await (
        await marketplace.createSale(
          nft.address,
          timeSale.id,
          timeSale.priceUSD,
          timeSale.tokens,
          timeSale.amount,
          timeSale.duration,
        )
      ).wait();
      const logs = getLogs(marketplace.interface, tx);
      const saleId = logs.find(
        ({ name }: { name: string }) => name === "SaleCreated",
      )?.args[0];
      sales.push(saleId);

      await network.provider.send("evm_increaseTime", [3600 * 24 * 7 + 100]);
      await network.provider.send("evm_mine");
      await expect(
        marketplace.buy(sales[1], timeSale.amount, feeReceiver.address),
      ).to.be.revertedWith("");
    });
  });

  describe("Audit results", () => {
    it("Should be able to emergency withdraw tokens/eth in any case", async () => {
      const lostAmount = ethers.utils.parseEther("2");
      await token.mint(accounts[0].address, lostAmount);
      await token.transfer(marketplace.address, lostAmount);

      await expect(
        marketplace
          .connect(accounts[5])
          .emergencyWithdraw(lostAmount, token.address, accounts[2].address),
      )
        .to.emit(token, "Transfer")
        .withArgs(marketplace.address, accounts[2].address, lostAmount);
      expect(await token.balanceOf(accounts[2].address)).to.be.equal(
        lostAmount,
      );
    });
  });
});
