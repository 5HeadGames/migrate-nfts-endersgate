import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";
import Web3 from "web3";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const data = loadJsonFile(fileName);
  const [Shop, EndersPack, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockSaleOwnableOnlyMultiTokens"),
    ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: data.library,
      },
    }),
    ethers.getSigners(),
  ]);

  const endersPacks = EndersPack.attach(data.pack);
  const shop = Shop.attach(data.shop);

  const tx = await endersPacks.setApprovalForAll(shop.address, true);
  console.log(await tx.wait());

  console.log("permision granted");

  const listings = [
    {
      price: 4999999,
      amount: "100",
      duration: "10000000000000000",
    },
    {
      price: 9999999,
      amount: "100",
      duration: "10000000000000000",
    },
    {
      price: 99999999,
      amount: "100",
      duration: "10000000000000000",
    },
    {
      price: 199999999,
      amount: "100",
      duration: "10000000000000000",
    },
  ];

  console.log([data.usdc]);

  for (let i = 0; i < listings.length; i++) {
    const tx = await shop.createSale(
      data.pack,
      i,
      listings[i].price,
      [data.usdc],
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
