import { ethers, network } from "hardhat";
import { loadJsonFile } from "../utils";

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

  // const endersPacks = EndersPack.attach(fileData.pack);
  const shop = Shop.attach(fileData.marketplaceOwnable);

  // const tx = await endersPacks.setApprovalForAll(shop.address, true);
  // console.log(await tx.wait());

  // console.log("permision granted");
  for (let i = 0; i < 4; i++) {
    const tx = await shop.createSale(
      fileData.pack,
      i,
      "10000000000",
      "1000",
      "10000000000",
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
