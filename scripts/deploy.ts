import {ethers, network} from "hardhat";

import {EndersGate} from "../types";
import {uploadIpfs, loadJsonFile, writeJsonFile} from "../utils";

const metadataLinks = require("../nfts/metadata/metadata.json");

const setUpMetadata = async (endersGate: EndersGate) => {
  const hashesData = Object.entries(metadataLinks).map((entry: any) => ({
    id: entry[0],
    hash: entry[1].split("/").reverse()[0],
  }));
  console.log("metadata");
  await endersGate.setIpfsHashBatch(
    hashesData.map(({id}) => id),
    hashesData.map(({hash}) => hash)
  );
};

const oldAddresses = {
  dracul: "0xE1C04284652be3771D514e5f05F823b35075D70F", //mainnet
  eross: "0x51BE175Fa7A56B98BCFFA124D6Bd31480b093214",
};
const DRACUL_ID = 215;
const EROSS_ID = 230;

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const accounts = await ethers.getSigners();
  const ipfsHash = fileData?.ipfs
    ? fileData.ipfs
    : await uploadIpfs({path: "/nfts/metadata/endersGate.json"});
  console.log("IPFS", ipfsHash.split("/").reverse()[0]);

  const endersGate = (await (
    await ethers.getContractFactory("EndersGate")
  ).deploy(
    "Enders Gate",
    "GATE",
    ipfsHash.split("/").reverse()[0],
    "https://ipfs.moralis.io:2053/ipfs/"
  )) as EndersGate;
  console.log("Enders Gate", endersGate.address);

  await setUpMetadata(endersGate);

  writeJsonFile({
    path: `/${fileName}`,
    data: {
      endersGate: endersGate.address,
      ipfs: ipfsHash,
      ...(network.name === "harmony_test"
        ? {
          dracul: oldAddresses.dracul,
          eross: oldAddresses.eross,
        }
        : {}),
    },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
