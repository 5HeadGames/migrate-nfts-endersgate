import { ethers, network } from "hardhat";
import fs from "fs";

const loadJsonFile = (file: string) => {
  try {
    const data = fs.readFileSync(file);
    return JSON.parse(data as any);
  } catch (err) {
    return {};
  }
};

async function main() {
  const appRoot = require("app-root-path");
  const draculFile = `nfts_holders/dracul.json`;
  const erossFile = `nfts_holders/eross.json`;
  const draculData = loadJsonFile(`${appRoot}/` + draculFile);
  const erossData = loadJsonFile(`${appRoot}/` + erossFile);

  const newDraculData = {
    ...draculData,
    size: draculData.result.length,
    result: draculData.result.map(({ amount }: any) => {
      return amount;
    }),
  };

  const newErossData = {
    ...erossData,
    size: erossData.result.length,
    result: erossData.result.map(({ amount }: any) => {
      return amount;
    }),
  };

  console.log(newDraculData.result.length, newErossData.result.length, "data");

  const configDraculData = JSON.stringify(newDraculData, null, 2);
  fs.writeFileSync(
    "nfts_holders/dracul_filtered_array_quantity.json",
    configDraculData,
  );
  const configErossData = JSON.stringify(newErossData, null, 2);
  fs.writeFileSync(
    "nfts_holders/eross_filtered_array_quantity.json",
    configErossData,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
