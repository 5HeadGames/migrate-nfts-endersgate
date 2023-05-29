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
  const configFileName = `addresses.${network.name}.json`;
  const data = loadJsonFile(`${appRoot}/` + configFileName);
  console.log(data);

  const [ComicsFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersComics"),
    ethers.getSigners(),
  ]);

  console.log("deploy:Comics");
  const Comics = (await ComicsFactory.deploy(
    "EndersComics",
    "EBP",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
    18,
  )) as EndersComics;

  await Comics.addToken(
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7",
    6,
  );

  await Comics.addToken(
    "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
    "0xE0dC07D5ED74741CeeDA61284eE56a2A0f7A4Cc9",
    18,
  );

  await Comics.addComic(25000000);
  await Comics.addComic(25000000);
  await Comics.addComic(25000000);
  await Comics.addComic(25000000);

  const configData = JSON.stringify(
    {
      ...data,
      Comics: Comics.address,
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
