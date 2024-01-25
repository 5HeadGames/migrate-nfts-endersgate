import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const marketplace = (
    await ethers.getContractFactory("ClockSaleOwnableOnlyMultiTokens")
  ).attach(fileData.marketplaceOwnable);

  await marketplace.updateSalePrice(0, 4990000);
  await marketplace.updateSalePrice(1, 9990000);
  await marketplace.updateSalePrice(2, 99990000);
  await marketplace.updateSalePrice(3, 199990000);
  console.log("SUCCESS");
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
