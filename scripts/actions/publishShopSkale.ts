import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";
import Web3 from "web3";
import { EndersPack } from "../../types";
import { Signer } from "ethers";
import { ClockSaleOwnableOnlyMultiTokens } from "../../types/contracts/OnlyMultitokens/ClockSaleOwnableOnlyMultiTokens";
import { ClockSaleOwnableOnlyMultiTokens__factory } from "../../types/factories/contracts/OnlyMultitokens/ClockSaleOwnableOnlyMultiTokens__factory";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [Shop, EndersPack, _accounts] = (await Promise.all([
    ethers.getContractFactory("ClockSaleOwnableOnlyMultiTokens"),
    ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: fileData.library,
      },
    }),
    ethers.getSigners(),
  ])) as [ClockSaleOwnableOnlyMultiTokens__factory, any, any];

  const endersPacks = EndersPack.attach(fileData.pack);
  const shop: ClockSaleOwnableOnlyMultiTokens = Shop.attach(
    fileData.marketplaceOwnable,
  );

  const tx = await endersPacks.setApprovalForAll(shop.address, true);
  console.log(await tx.wait());

  console.log("permision granted");

  const listings = [
    {
      price: 5000000,
      amount: "100",
      duration: "10000000000000000",
    },
    {
      price: 10000000,
      amount: "100",
      duration: "10000000000000000",
    },
    {
      price: 20000000,
      amount: "100",
      duration: "10000000000000000",
    },
    {
      price: 40000000,
      amount: "100",
      duration: "10000000000000000",
    },
  ];

  for (let i = 0; i < listings.length; i++) {
    const tx = await shop.createSale(
      fileData.pack,
      i,
      listings[i].price,
      [fileData.usdc],
      listings[i].amount,
      listings[i].duration,
    );
    console.log(i, " TX", await tx.wait());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
