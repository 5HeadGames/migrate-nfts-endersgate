import { ethers, network } from "hardhat";
import fs from "fs";
import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";

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

  const [owner] = await ethers.getSigners();

  const ERC20Factory = await ethers.getContractFactory("MockERC20");
  const USDC = await ERC20Factory.attach(data.usdc);
  const BUSD = await ERC20Factory.attach(data.busd);

  await USDC.mint(owner.address, "1000000000000");
  await BUSD.mint(owner.address, "1000000000000");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
