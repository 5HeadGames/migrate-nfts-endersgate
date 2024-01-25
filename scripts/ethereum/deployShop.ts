import { ethers, network } from "hardhat";
import fs from "fs";
import { ClockSaleOwnable } from "../../types";
const OWNER_CUT = "400";

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

  const [SalesOwnableFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockSaleOwnable"),
    ethers.getSigners(),
  ]);

  console.log(
    "deploy:marketplaceOwnable",
    _accounts[0].address,
    network.name,
    network.provider,
  );
  const marketplaceOwnable = (await SalesOwnableFactory.deploy(
    _accounts[0].address,
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    18,
  )) as ClockSaleOwnable;

  console.log("setting allowed: marketplaceOwnable");
  await marketplaceOwnable.setNftAllowed(data.comics, true);

  console.log("setting tokens allowed: marketplace");
  await marketplaceOwnable.addToken(
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
    6,
  );

  const configData = JSON.stringify(
    {
      ...data,
      shop: marketplaceOwnable.address,
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
