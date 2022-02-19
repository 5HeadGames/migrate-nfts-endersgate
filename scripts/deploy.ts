import {ethers, network, upgrades} from "hardhat";
import fs from "fs";

import {EndersGate} from '../types'

const loadJsonFile = (file: string) => {
  try {
    const data = fs.readFileSync(file);
    return JSON.parse(data as any);
  } catch (err) {
    return {};
  }
};

async function main(): Promise<void> {
  const accounts = await ethers.getSigners();
  const endersGate = (await upgrades.deployProxy(
    await ethers.getContractFactory("EndersGate"),
    {
      kind: "uups",
    }
  )) as EndersGate;
  const dracul = await (await ethers.getContractFactory("ERC1155card")).deploy("Dracul");
  const eross = await (await ethers.getContractFactory("ERC1155card")).deploy("Eross");
  const exchange = await (
    await ethers.getContractFactory("ExchangeERC1155")
  ).deploy([dracul.address, eross.address], [1, 1], [1, 2], endersGate.address);

  await endersGate.grantRole(await endersGate.MINTER_ROLE(), exchange.address);

  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const configData = JSON.stringify(
    {
      ...fileData,
      endersGate: endersGate.address,
      dracul: dracul.address,
      eross: eross.address,
      exchange: exchange.address
    },
    null,
    2
  );

  fs.writeFileSync(fileName, configData);
  console.log(`Generated ${fileName}: ${configData}`);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

