import { ethers, network } from "hardhat";
import fs from "fs";
import { loadJsonFile } from "../utils";
// import { ClockSaleOwnable } from "../typechain";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [Marketplace, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockSale"),
    ethers.getSigners(),
  ]);

  const marketplace = Marketplace.attach(fileData.marketplace);
  const lastSale = await marketplace.tokenIdTracker();

  const rawSales = await marketplace.getSales(
    new Array(lastSale).fill(0 as any).map((a, i) => i),
  );

  console.log(rawSales);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
