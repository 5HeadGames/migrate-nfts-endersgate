import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { BigNumber } from "@ethersproject/bignumber";

import { getLogs } from "../utils";
import {
  EndersGate,
  EndersRentNative,
  MockERC20,
  RentMultiTokens,
} from "../types";

const Rent_STATUS = {
  created: 0,
  inRent: 1,
  rentEnd: 2,
  cancel: 3,
};

const parseRent = (Rent: any[]) => {
  return {
    seller: Rent[0],
    buyer: Rent[1],
    nft: Rent[2],
    nftId: Rent[3],
    amount: Rent[4],
    price: Rent[5],
    duration: Rent[6],
    startedAt: Rent[7],
    status: Rent[8],
  };
};

describe("Rent", function () {
  let accounts: SignerWithAddress[],
    rent: EndersRentNative,
    nft: EndersGate,
    token: MockERC20,
    genesisBlock: number;
  const feeReceiver = ethers.Wallet.createRandom();

  const RentsData = [
    {
      id: 0,
      price: 35000000,
      duration: 0,
    },
    {
      id: 2,
      price: 35000000,
      duration: 0,
    },
    {
      id: 3,
      price: 4400000,
      duration: 0,
    },
    {
      id: 1,
      price: 4400000,
      duration: 0,
    },
  ];
  let Rents: number[] = [];
  const OWNER_CUT = "400";

  this.beforeAll(async () => {
    const [Rent, NftFactory, MockERC20, _accounts] = await Promise.all([
      ethers.getContractFactory("EndersRentNative"),
      ethers.getContractFactory("EndersGate"),
      ethers.getContractFactory("MockERC20"),
      ethers.getSigners(),
    ]);
    const ids = new Array(10).fill(0).map((a, i) => i);
    accounts = _accounts;

    [nft, token] = await Promise.all([
      NftFactory.deploy("", "", "", "", {
        receiver: feeReceiver.address,
        feeNumerator: 400,
      }),
      MockERC20.deploy(),
    ]);

    rent = await Rent.deploy(feeReceiver.address, OWNER_CUT);

    genesisBlock = await ethers.provider.getBlockNumber();

    await nft.mintBatch(
      accounts[0].address,
      ids,
      ids.map(() => 100),
      [],
    );
  });

  describe("Configuration initialization", () => {
    it("should initialize owner", async () => {
      const owner = await rent.owner();
      expect(owner).to.equal(accounts[0].address);
      await rent.transferOwnership(accounts[5].address);
      expect(await rent.owner()).to.equal(accounts[5].address);
    });

    it("should initialize fee receiver share properly", async () => {
      const ownerCut = await rent.ownerCut();
      expect(ownerCut).to.equal(OWNER_CUT);
    });

    it("should initialize fee receiver properly", async () => {
      const receiver = await rent.feeReceiver();
      expect(receiver).to.equal(feeReceiver.address);
    });

    it("should initialize genesis block", async () => {
      const block = await rent.genesisBlock();
      expect(block, "not genesis block").to.be.equal(genesisBlock.toString());
    });

    it("Owner should whitelist nfts", async () => {
      await rent.connect(accounts[5]).setNftAllowed(nft.address, true);

      expect(
        await rent.isAllowed(nft.address),
        "Not allowed properly",
      ).to.be.equal(true);
      await expect(
        rent.connect(accounts[1]).setNftAllowed(nft.address, true),
        "Not owner",
      ).to.be.revertedWith("");
    });

    it("Owner should stop marketplace", async () => {
      expect(
        await rent.connect(accounts[5]).paused(),
        "Stopped at beggining",
      ).to.be.equal(false);
      await expect(
        rent.connect(accounts[5]).restartTrading(),
        "restart when not stopped",
      ).to.be.revertedWith("");
      await expect(
        rent.connect(accounts[1]).stopTrading(),
        "not owner should stop trading",
      ).to.be.revertedWith("");

      await rent.connect(accounts[5]).stopTrading();

      expect(
        await rent.connect(accounts[5]).paused(),
        "should be paused",
      ).to.be.equal(true);
      await expect(
        rent.connect(accounts[5]).stopTrading(),
        "trading already stopped",
      ).to.be.revertedWith("");
      await expect(
        rent.connect(accounts[1]).restartTrading(),
        "only owner should restart",
      ).to.be.revertedWith("");

      await rent.connect(accounts[5]).restartTrading();
      expect(await rent.paused(), "should be paused").to.be.equal(false);
    });

    it("Should allow owner to change the fee receiver", async () => {
      const newFeeReceiver = ethers.Wallet.createRandom();
      await rent.connect(accounts[5]).setFeeReceiver(newFeeReceiver.address);

      expect(await rent.feeReceiver()).to.be.equal(newFeeReceiver.address);
      await expect(
        rent.connect(accounts[1]).setFeeReceiver(feeReceiver.address),
      ).to.be.revertedWith("");

      await rent.connect(accounts[5]).setFeeReceiver(feeReceiver.address);
    });

    it("Should allow owner to change the fee", async () => {
      const newOwnerCut = Number(OWNER_CUT) + 100;
      await rent.connect(accounts[5]).setOwnerCut(newOwnerCut);

      expect((await rent.ownerCut()).toNumber()).to.be.equal(newOwnerCut);
      await expect(
        rent.connect(accounts[1]).setOwnerCut(OWNER_CUT),
      ).to.be.revertedWith("");

      await rent.connect(accounts[5]).setOwnerCut(OWNER_CUT);
    });
  });

  describe("Rent Process", () => {
    it("Should create an auction", async () => {
      for await (let currentRent of RentsData) {
        const { id, price, duration } = currentRent;

        await nft.setApprovalForAll(rent.address, true);
        const tx = await (await rent.createRent(nft.address, id, price)).wait();

        const logs = getLogs(rent.interface, tx);
        const RentId = logs.find(
          ({ name }: { name: string }) => name === "RentAuctionCreated",
        )?.args[0];
        Rents.push(RentId);

        const Rent = parseRent(
          (await rent.getRents([(RentId as BigNumber).toNumber()]))[0],
        );

        expect(Rent.seller).to.be.equal(accounts[0].address);
        expect(Rent.buyer).to.be.equal(ethers.constants.AddressZero);
        expect(Rent.nft).to.be.equal(nft.address);
        expect(Rent.nftId).to.be.equal(id);
        expect(Rent.amount).to.be.equal(1);
        expect(Rent.price).to.be.equal(price);
        expect(Rent.duration).to.be.equal(duration);
        expect(Rent.status).to.be.equal(Rent_STATUS.created);
      }
    });

    it("Should set correctly the price in USD", async () => {
      for await (let currentRent of RentsData) {
        const { id, price } = currentRent;

        await nft.setApprovalForAll(rent.address, true);
        const tx = await (await rent.createRent(nft.address, id, price)).wait();

        const logs = getLogs(rent.interface, tx);
        const RentId = logs.find(
          ({ name }: { name: string }) => name === "RentAuctionCreated",
        )?.args[0];

        const Rent = parseRent(
          (await rent.getRents([(RentId as BigNumber).toNumber()]))[0],
        );

        expect((await rent.rents(RentId)).price).to.be.equal(price);
      }
    });

    it("Should get batch Rents", async () => {
      const allRents = (await rent.getRents(Rents)).map((Rent: any) =>
        parseRent(Rent),
      );
      allRents.forEach((Rent: any, i: any) => {
        const { id, price, duration } = RentsData[i];
        expect(Rent.seller).to.be.equal(accounts[0].address);
        expect(Rent.nft).to.be.equal(nft.address);
        expect(Rent.nftId).to.be.equal(id);
        expect(Rent.amount).to.be.equal(1);
        expect(Rent.price).to.be.equal(price);
        expect(Rent.duration).to.be.equal(duration);
        expect(Rent.status).to.be.equal(Rent_STATUS.created);
      });
    });

    it("Should not cancel Rents inRent", async () => {
      await expect(
        rent.connect(accounts[2]).cancelRent(Rents[3]),
        "only owner of Rent",
      ).to.be.revertedWith("");
      const daysOfRent = 2;
      const cost = (await rent.rents(Rents[3])).price.mul(daysOfRent);

      await rent.connect(accounts[2]).rent(Rents[3], daysOfRent, {
        value: cost,
      });

      await expect(rent.cancelRent(Rents[3])).to.be.revertedWith(
        "Rental:NFT_IN_RENT",
      );
    });

    it("Should cancel Rents", async () => {
      await expect(
        rent.connect(accounts[2]).cancelRent(Rents[0]),
        "only owner of Rent",
      ).to.be.revertedWith("");

      const prevBalance = await nft.balanceOf(
        accounts[0].address,
        RentsData[0].id,
      );
      const logs = getLogs(
        rent.interface,
        await (await rent.cancelRent(Rents[0])).wait(),
      );
      const RentId = logs.find(
        ({ name }: { name: string }) => name === "RentAuctionCancelled",
      )?.args[0];

      const postBalance = await nft.balanceOf(
        accounts[0].address,
        RentsData[0].id,
      );
      const [singleRent] = await rent.getRents([Rents[0]]);

      expect(singleRent.status).to.be.equal(Rent_STATUS.cancel);
      expect(prevBalance.add(1).toString()).to.be.equal(postBalance.toString());
      expect(RentId, "removed wrong Rent id").to.be.equal("0");
    });

    it("Should not buy cancelled Rents", async () => {
      await expect(rent.rent(Rents[0], 3600)).to.be.revertedWith("");
    });

    it("Should rent by calculated amounts", async () => {
      const daysOfRent = 2;
      const cost = (await rent.rents(Rents[1])).price.mul(daysOfRent);
      const buyer = accounts[1];
      const [buyerBalance, sellerBalance, feeReceiverBalance] =
        await Promise.all([
          await ethers.provider.getBalance(buyer.address),
          await ethers.provider.getBalance(accounts[0].address),
          await ethers.provider.getBalance(feeReceiver.address),
        ]);

      const preBalanceWrapped = await rent.balanceOf(buyer.address, Rents[1]);

      expect(preBalanceWrapped).to.be.equal(0);

      const receipt = await (
        await rent.connect(buyer).rent(Rents[1], daysOfRent, { value: cost })
      ).wait();
      const log = getLogs(rent.interface, receipt).find(
        ({ name }) => name === "RentedSuccessful",
      );
      const [postBuyerBalance, postSellerBalance, postFeeReceiverBalance] =
        await Promise.all([
          await ethers.provider.getBalance(buyer.address),
          await ethers.provider.getBalance(accounts[0].address),
          await ethers.provider.getBalance(feeReceiver.address),
        ]);

      const feeAmount = cost.mul(OWNER_CUT).div(10000);

      expect(
        postFeeReceiverBalance.sub(feeReceiverBalance).toString(),
      ).to.be.equal(feeAmount.toString());

      expect(postSellerBalance.sub(sellerBalance).toString()).to.be.equal(
        cost.sub(feeAmount).toString(),
      );

      expect(buyerBalance.sub(postBuyerBalance)).to.be.gt(cost.toString());
      expect(log?.args[0].toString(), "Wrong Rent ID").to.be.equal(Rents[1]);
      expect(log?.args[1].toString(), "Wrong buyer").to.be.equal(buyer.address); //buyer
      expect(log?.args[2].toString(), "Wrong cost").to.be.equal(
        cost.toString(),
      );
      expect(log?.args[3].toString(), "Wrong nft amount").to.be.equal(
        String(daysOfRent * 86400),
      );

      const rentData = parseRent(
        (
          await rent.getRents([(Rents[1] as unknown as BigNumber).toNumber()])
        )[0],
      );

      const balanceWrapped = await rent.balanceOf(
        buyer.address,
        rentData.nftId,
      );

      expect(balanceWrapped).to.be.equal(1);
    });

    it("Should rent a batch by calculated amounts", async () => {
      const daysOfRent = 2;

      const timeRent = [
        {
          id: 3,
          priceUSD: 1000000,
        },
        {
          id: 5,
          priceUSD: 1500000,
        },
        {
          id: 6,
          priceUSD: 1800000,
        },
      ];

      for (let i = 0; i < timeRent.length; i++) {
        await rent.createRent(
          nft.address,
          timeRent[i].id,
          timeRent[i].priceUSD,
        );
      }

      const buyer = accounts[1];
      const [buyerBalance, sellerBalance, feeReceiverBalance] =
        await Promise.all([
          await ethers.provider.getBalance(buyer.address),
          await ethers.provider.getBalance(accounts[0].address),
          await ethers.provider.getBalance(feeReceiver.address),
        ]);

      console.log(sellerBalance, feeReceiverBalance, "Seller/Fee balances");

      const rentId = (await rent.tokenIdTracker()).sub(1);
      const cost = await timeRent
        .map(async ({}, i) => {
          const price = (await rent.rents(rentId.sub(i))).price;
          return price.mul(daysOfRent);
        })
        .reduce(async (a, b) => {
          return (await a).add(await b);
        });

      const receipt = await (
        await rent
          .connect(buyer)
          .rentBatch([rentId, rentId.sub(1), rentId.sub(2)], daysOfRent, {
            value: cost.toString(),
          })
      ).wait();

      const log = getLogs(rent.interface, receipt).find(
        ({ name }) => name === "RentedSuccessful",
      );
      const [postBuyerBalance, postSellerBalance, postFeeReceiverBalance] =
        await Promise.all([
          await ethers.provider.getBalance(buyer.address),
          await ethers.provider.getBalance(accounts[0].address),
          await ethers.provider.getBalance(feeReceiver.address),
        ]);

      const feeAmount = cost.mul(OWNER_CUT).div(10000);

      expect(
        postFeeReceiverBalance.sub(feeReceiverBalance).toString(),
      ).to.be.equal(feeAmount.toString());

      expect(postSellerBalance.sub(sellerBalance).toString()).to.be.equal(
        cost.sub(feeAmount).toString(),
      );

      expect(buyerBalance.sub(postBuyerBalance)).to.be.gt(cost.toString());

      const rentData = parseRent(
        await rent.getRents(timeRent.map(({ id }) => id)),
      );

      const balanceWrapped = await rent.balanceOfBatch(
        new Array(timeRent.length).fill(buyer.address),
        timeRent.map(({ id }) => id),
      );

      console.log(balanceWrapped, rentData);
    });

    it("Should no rent while the nft is already rented", async () => {
      const timeRent = {
        id: 2,
        priceUSD: 10000000,
        duration: 2,
        tokens: [feeReceiver.address, token.address],
      };
      await nft.setApprovalForAll(rent.address, true);
      const tx = await (
        await rent.createRent(nft.address, timeRent.id, timeRent.priceUSD)
      ).wait();
      const rentId = (await rent.tokenIdTracker()).sub(1);
      const price = (await rent.rents(rentId)).price.mul(timeRent.duration);

      await rent.rent(rentId, timeRent.duration, {
        value: price,
      });
      const logs = getLogs(rent.interface, tx);
      const RentId = logs.find(
        ({ name }: { name: string }) => name === "RentAuctionCreated",
      )?.args[0];
      Rents.push(RentId);
      await expect(
        rent.rent(rentId, timeRent.duration, {
          value: price,
        }),
      ).to.be.revertedWith("Rental:NFT NOT AVAILABLE TO RENT");
      await network.provider.send("evm_increaseTime", [3600 * 24 * 2 + 100]);
      await network.provider.send("evm_mine");
    });

    it("Should no transfer Rent Wrapped NFTs", async () => {
      const timeRent = {
        id: 2,
        priceUSD: 10000000,
        duration: 2,
      };
      await nft.setApprovalForAll(rent.address, true);
      const tx = await (
        await rent.createRent(nft.address, timeRent.id, timeRent.priceUSD)
      ).wait();
      const rentId = (await rent.tokenIdTracker()).sub(1);
      const price = (await rent.rents(rentId)).price.mul(timeRent.duration);

      await rent.connect(accounts[2]).rent(rentId, timeRent.duration, {
        value: price,
      });

      const logs = getLogs(rent.interface, tx);
      const RentId = logs.find(
        ({ name }: { name: string }) => name === "RentAuctionCreated",
      )?.args[0];
      Rents.push(RentId);
      await expect(
        rent
          .connect(accounts[2])
          .safeBatchTransferFrom(
            accounts[2].address,
            feeReceiver.address,
            [timeRent.id],
            [1],
            "0x00",
          ),
      ).to.be.revertedWith("Rental: WRAPPED NFTS CAN'T BE TRANSFERED");

      await expect(
        rent
          .connect(accounts[2])
          .safeTransferFrom(
            accounts[2].address,
            feeReceiver.address,
            timeRent.id,
            1,
            "0x00",
          ),
      ).to.be.revertedWith("Rental: WRAPPED NFTS CAN'T BE TRANSFERED");
      await network.provider.send("evm_increaseTime", [3600 * 24 * 2 + 100]);
      await network.provider.send("evm_mine");
    });

    it("Should redeem after time rent is passed", async () => {
      const timeRent = {
        id: 3,
        priceUSD: 1000000,
        duration: 2,
        tokens: [token.address, feeReceiver.address],
      };
      await nft.setApprovalForAll(rent.address, true);
      const prevCreateBalance = await nft.balanceOf(
        accounts[0].address,
        timeRent.id,
      );
      const tx = await (
        await rent.createRent(nft.address, timeRent.id, timeRent.priceUSD)
      ).wait();
      const rentId = (await rent.tokenIdTracker()).sub(1);
      const afterCreateBalance = await nft.balanceOf(
        accounts[0].address,
        timeRent.id,
      );
      expect(afterCreateBalance).to.be.equal(prevCreateBalance.sub(1));
      await rent.connect(accounts[1]).rent(rentId, timeRent.duration, {
        value: (await rent.rents(rentId)).price.mul(timeRent.duration),
      });
      const logs = getLogs(rent.interface, tx);
      const RentId = logs.find(
        ({ name }: { name: string }) => name === "RentAuctionCreated",
      )?.args[0];
      Rents.push(RentId);
      await network.provider.send("evm_increaseTime", [3600 * 24 * 2 + 100]);
      await network.provider.send("evm_mine");
      await rent.redeemRent(rentId);
      // expect()
      const afterRentFinishedBalance = await nft.balanceOf(
        accounts[0].address,
        3,
      );
      expect(afterRentFinishedBalance).to.be.equal(prevCreateBalance);
    });

    it("Should not redeem while time rent is not done yet", async () => {
      const timeRent = {
        id: 4,
        priceUSD: 1000000,
        duration: 7, // 7 days
        tokens: [token.address, feeReceiver.address],
      };
      await nft.setApprovalForAll(rent.address, true);
      const prevCreateBalance = await nft.balanceOf(
        accounts[0].address,
        timeRent.id,
      );
      const tx = await (
        await rent.createRent(nft.address, timeRent.id, timeRent.priceUSD)
      ).wait();
      const rentId = (await rent.tokenIdTracker()).sub(1);
      const afterCreateBalance = await nft.balanceOf(
        accounts[0].address,
        timeRent.id,
      );
      expect(afterCreateBalance).to.be.equal(prevCreateBalance.sub(1));
      await rent.connect(accounts[1]).rent(rentId, timeRent.duration, {
        value: (await rent.rents(rentId)).price.mul(timeRent.duration),
      });
      const logs = getLogs(rent.interface, tx);
      const RentId = logs.find(
        ({ name }: { name: string }) => name === "RentAuctionCreated",
      )?.args[0];
      Rents.push(RentId);
      await network.provider.send("evm_increaseTime", [3600 * 24 * 6]); //6 days in purpouse
      await network.provider.send("evm_mine");
      (await expect(rent.redeemRent(rentId))).to.be.reverted;
    });
  });

  describe("Audit results", () => {
    it("Should be able to emergency withdraw tokens/eth in any case", async () => {
      const lostAmount = ethers.utils.parseEther("2");
      await token.mint(accounts[0].address, lostAmount);
      await token.transfer(rent.address, lostAmount);

      await expect(
        rent
          .connect(accounts[5])
          .emergencyWithdraw(lostAmount, token.address, accounts[1].address),
      )
        .to.emit(token, "Transfer")
        .withArgs(rent.address, accounts[1].address, lostAmount);
      expect(await token.balanceOf(accounts[1].address)).to.be.equal(
        lostAmount,
      );
    });
  });
});
