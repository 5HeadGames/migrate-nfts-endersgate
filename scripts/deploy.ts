import {ethers, network, upgrades} from "hardhat";

import {EndersGate} from "../types";
import {uploadIpfs, loadJsonFile, writeJsonFile} from "../utils";

const metadataLinks = require("../nfts/metadata/metadata.json");

const oldAddresses = {
  dracul: "",
  eross: "",
};

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const accounts = await ethers.getSigners();
  const ipfsHash = fileData?.ipfs
    ? fileData.ipfs
    : await uploadIpfs({path: "/nfts/metadata/endersGate.json"});
  console.log("IPFS", ipfsHash.split("/").reverse()[0]);

  //const dracul = await (await ethers.getContractFactory("ERC1155card")).deploy("Dracul");
  //console.log("Dracul", dracul.address);

  //const eross = await (await ethers.getContractFactory("ERC1155card")).deploy("Eross");
  //console.log("Eross", eross.address);

  const endersGate = (await (
    await ethers.getContractFactory("EndersGate")
  ).deploy(
    "Enders Gate",
    "GATE",
    ipfsHash.split("/").reverse()[0],
    "https://ipfs.moralis.io:2053/ipfs/"
  )) as EndersGate;
  console.log("Enders Gate", endersGate.address);

  const hashesData = Object.entries(metadataLinks).map((entry: any) => ({
    id: entry[0],
    hash: entry[1].split("/").reverse()[0],
  }));
  await endersGate.setIpfsHashBatch(
    hashesData.map(({id}) => id),
    hashesData.map(({hash}) => hash)
  );

  const exchange = await (
    await ethers.getContractFactory("ExchangeERC1155")
  ).deploy([oldAddresses.dracul, oldAddresses.eross], [1, 1], [1, 2], endersGate.address);
  console.log("Exchange", exchange.address);

  await endersGate.grantRole(await endersGate.MINTER_ROLE(), exchange.address);

  writeJsonFile({
    path: `/${fileName}`,
    data: {
      endersGate: endersGate.address,
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
