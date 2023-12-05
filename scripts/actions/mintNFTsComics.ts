import { ethers, network } from "hardhat";
import fs from "fs";
import { EndersComics } from "../types";
// import { ClockSaleOwnable } from "../typechain";

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
  const configFileName = `addresses/addresses.${network.name}.json`;
  const data = loadJsonFile(`${appRoot}/` + configFileName);
  console.log(data);

  const [ComicsFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersComics"),
    ethers.getSigners(),
  ]);

  console.log("deploy:Comics");
  const Comics = (await ComicsFactory.attach(
    "0x7BF1678fA1F94D5D6D83e6a4c48C7D44e3F5a693",
  )) as EndersComics;

  await Comics.mint("0xBD115290E749483D8f970d6925C51EFC0A7E3a7c", 1, "0x00");
  await Comics.balanceOf("0xBD115290E749483D8f970d6925C51EFC0A7E3a7c", 1);

  const configData = JSON.stringify(
    {
      ...data,
      comics: Comics.address,
    },
    null,
    2,
  );
  fs.writeFileSync(configFileName, configData);
  console.log("SUCCESS", configData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
