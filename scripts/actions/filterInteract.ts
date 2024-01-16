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
  const interacted = `nfts_holders/interactedWithHarmony.json`;
  const data = loadJsonFile(`${appRoot}/` + interacted);

  const newData = data.result.filter((value: any, index: any) => {
    return data.result.indexOf(value) === index;
  });

  const configDraculData = JSON.stringify({ result: newData }, null, 2);
  fs.writeFileSync("nfts_holders/interactedWithHarmony.json", configDraculData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
