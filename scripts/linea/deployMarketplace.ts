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

  const [SalesFactory, SalesOwnableFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("ClockSaleMultiTokens"),
    ethers.getContractFactory("ClockSaleOwnable"),
    ethers.getSigners(),
  ]);

  console.log("deploy:marketplace");
  const marketplace = await SalesFactory.deploy(
    _accounts[0].address,
    "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
    "0x3c6Cd9Cc7c7a4c2Cf5a82734CD249D7D593354dA",
    18,
    OWNER_CUT,
  );

  console.log("deploy:marketplaceOwnable");
  const marketplaceOwnable = (await SalesOwnableFactory.deploy(
    _accounts[0].address,
    "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
    "0x3c6Cd9Cc7c7a4c2Cf5a82734CD249D7D593354dA",
    18,
    OWNER_CUT,
  )) as ClockSaleOwnable;

  console.log("setting allowed: marketplace");
  await marketplace.setNftAllowed(data.endersGate, true);
  await marketplace.setNftAllowed(data.pack, true);

  console.log("setting tokens allowed: marketplace");
  await marketplace.addToken(
    "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
    "0xAADAa473C1bDF7317ec07c915680Af29DeBfdCb5",
    6,
  );

  console.log("setting allowed: marketplaceOwnable");
  await marketplaceOwnable.setNftAllowed(data.endersGate, true);
  await marketplaceOwnable.setNftAllowed(data.pack, true);

  await marketplaceOwnable.addToken(
    "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
    "0xAADAa473C1bDF7317ec07c915680Af29DeBfdCb5",
    6,
  );

  const configData = JSON.stringify(
    {
      ...data,
      marketplace: marketplace.address,
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
