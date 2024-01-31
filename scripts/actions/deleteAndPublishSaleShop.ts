import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const marketplace = (
    await ethers.getContractFactory("ClockSaleOwnableOnlyMultiTokens")
  ).attach(fileData.marketplaceOwnable);

  await marketplace.cancelSale(4);
  await marketplace.cancelSale(5);
  await marketplace.cancelSale(6);
  await marketplace.cancelSale(7);
  await marketplace.createSale(
    fileData.pack,
    0,
    4990000,
    [fileData.usdc],
    95,
    "10000000000000000",
  );
  await marketplace.createSale(
    fileData.pack,
    1,
    9990000,
    [fileData.usdc],
    99,
    "10000000000000000",
  );
  await marketplace.createSale(
    fileData.pack,
    2,
    99990000,
    [fileData.usdc],
    97,
    "10000000000000000",
  );
  await marketplace.createSale(
    fileData.pack,
    3,
    199990000,
    [fileData.usdc],
    99,
    "10000000000000000",
  );

  console.log("SUCCESS");
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
