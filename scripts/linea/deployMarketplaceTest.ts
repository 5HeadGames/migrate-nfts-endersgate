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
    "0x2C1b868d6596a18e32E61B901E4060C872647b6C",
    "0xcCFF6C2e770Faf4Ff90A7760E00007fd32Ff9A97",
    18,
    OWNER_CUT,
  );

  console.log("deploy:marketplaceOwnable");
  const marketplaceOwnable = (await SalesOwnableFactory.deploy(
    _accounts[0].address,
    "0x2C1b868d6596a18e32E61B901E4060C872647b6C",
    "0xcCFF6C2e770Faf4Ff90A7760E00007fd32Ff9A97",
    18,
    OWNER_CUT,
  )) as ClockSaleOwnable;

  console.log("setting allowed: marketplace");
  await marketplace.setNftAllowed(data.endersGate, true);
  await marketplace.setNftAllowed(data.pack, true);

  console.log("setting tokens allowed: marketplace");
  await marketplace.addToken(
    data.usdc,
    "0xd8d927e5d52Bb7cdb2C0ae6f55ACcB18e9a2B9D7",
    6,
  );

  console.log("setting allowed: marketplaceOwnable");
  await marketplaceOwnable.setNftAllowed(data.endersGate, true);
  await marketplaceOwnable.setNftAllowed(data.pack, true);

  await marketplaceOwnable.addToken(
    data.usdc,
    "0xd8d927e5d52Bb7cdb2C0ae6f55ACcB18e9a2B9D7",
    6,
  );

  const configData = JSON.stringify(
    {
      ...data,
      marketplace: marketplace.address,
      marketplaceOwnable: marketplaceOwnable.address,
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
