import { ethers, network } from "hardhat";
import fs from "fs";
import {
  ClockSaleOwnable,
  ClockSaleOwnableFindora,
  EndersRentOnlyMultiTokens,
} from "../../types";
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

  const [RentFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersRentOnlyMultiTokens"),
    ethers.getSigners() as any,
  ]);

  const rent: EndersRentOnlyMultiTokens = await RentFactory.deploy(
    _accounts[0].address,
    OWNER_CUT,
  );
  await rent.setNftAllowed(data.endersGate, true);
  await rent.addToken("0xCC205196288B7A26f6D43bBD68AaA98dde97276d", 6);

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
