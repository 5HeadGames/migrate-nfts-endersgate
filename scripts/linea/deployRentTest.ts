import { ethers, network } from "hardhat";
import fs from "fs";
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

  const [SalesFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("RentMultiTokens"),
    ethers.getSigners(),
  ]);

  console.log("deploy:marketplace");
  const rent = await SalesFactory.deploy(
    _accounts[0].address,
    "0xf3cd27813b5ff6adea3805dcf181053ac62d6ec3",
    "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
    18,
    OWNER_CUT,
  );

  console.log("setting allowed: rent");
  await rent.setNftAllowed(data.endersGate, true);

  console.log("setting tokens allowed: rent");
  await rent.addToken(
    data.usdc,
    "0xd8d927e5d52Bb7cdb2C0ae6f55ACcB18e9a2B9D7",
    6,
  );

  const configData = JSON.stringify(
    {
      ...data,
      rent: rent.address,
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
