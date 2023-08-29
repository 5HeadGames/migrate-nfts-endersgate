import { ethers, network } from "hardhat";
import { loadJsonFile } from "../utils";
import Web3 from "web3";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [Shop, EndersPack, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockSaleOwnableFindora"),
    ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: fileData.library,
      },
    }),
    ethers.getSigners(),
  ]);

  const endersPacks = EndersPack.attach(fileData.pack);
  const shop = Shop.attach(fileData.marketplaceOwnable);

  const tx = await endersPacks.setApprovalForAll(shop.address, true);
  console.log(await tx.wait());

  console.log("permision granted");

  const listings = [
    {
      price: Web3.utils.toWei("10000", "ether"),
      amount: "200",
      duration: "10000000000000000",
    },
    {
      price: Web3.utils.toWei("20000", "ether"),
      amount: "100",
      duration: "10000000000000000",
    },
    {
      price: Web3.utils.toWei("40000", "ether"),
      amount: "50",
      duration: "10000000000000000",
    },
    {
      price: Web3.utils.toWei("80000", "ether"),
      amount: "25",
      duration: "10000000000000000",
    },
  ];

  for (let i = 0; i < listings.length; i++) {
    const tx = await shop.createSale(
      fileData.pack,
      i,
      listings[i].price,
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
