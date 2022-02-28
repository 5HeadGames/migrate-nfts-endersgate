import {ethers, network, upgrades} from "hardhat";

import {EndersGate} from "../types";
import {uploadIpfs, loadJsonFile, writeJsonFile} from "../utils";

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const accounts = await ethers.getSigners();
  const ipfsHash = fileData?.ipfs
    ? fileData.ipfs
    : await uploadIpfs({path: "/nfts/metadata/contract.json"});
  console.log("IPFS", ipfsHash.split("/").reverse()[0]);

  const dracul = await (await ethers.getContractFactory("ERC1155card")).deploy("Dracul");
  console.log("Dracul", dracul.address);

  const eross = await (await ethers.getContractFactory("ERC1155card")).deploy("Eross");
  console.log("Eross", eross.address);

  const endersGate = (await (
    await ethers.getContractFactory("EndersGate")
  ).deploy(
    "Enders Gate",
    "GATE",
    ipfsHash.split("/").reverse()[0],
    "https://ipfs.io/ipfs/"
  )) as EndersGate;
  console.log("Enders Gate", endersGate.address);

  const exchange = await (
    await ethers.getContractFactory("ExchangeERC1155")
  ).deploy([dracul.address, eross.address], [1, 1], [1, 2], endersGate.address);
  console.log("Exchange", exchange.address);

  await endersGate.grantRole(await endersGate.MINTER_ROLE(), exchange.address);

  writeJsonFile({
    path: `/${fileName}`,
    data: {
      endersGate: endersGate.address,
      dracul: dracul.address,
      eross: eross.address,
      exchange: exchange.address,
      ipfs: ipfsHash,
    },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });