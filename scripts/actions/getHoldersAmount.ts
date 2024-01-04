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
  const draculFile = `nfts_holders/dracul_filtered.json`;
  const erossFile = `nfts_holders/eross_filtered.json`;
  const draculData = loadJsonFile(`${appRoot}/` + draculFile);
  const erossData = loadJsonFile(`${appRoot}/` + erossFile);

  console.log(
    "DRACUL OWNERS: ",
    draculData.result.length,
    "EROSS OWNERS: ",
    erossData.result.length,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
