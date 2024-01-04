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

  console.log(draculData, erossData, "data");

  const newDraculData = {
    ...draculData,
    result: draculData.result.map(({ owner_of, amount }: any) => {
      return { owner_of, amount };
    }),
  };

  const newErossData = {
    ...erossData,
    result: erossData.result.map(({ owner_of, amount }: any) => {
      return { owner_of, amount };
    }),
  };

  const configDraculData = JSON.stringify(newDraculData, null, 2);
  fs.writeFileSync("nfts_holders/dracul_filtered.json", configDraculData);
  const configErossData = JSON.stringify(newErossData, null, 2);
  fs.writeFileSync("nfts_holders/eross_filtered.json", configErossData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
