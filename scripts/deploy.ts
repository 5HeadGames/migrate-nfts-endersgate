import { ethers, network } from "hardhat";

import { EndersGate } from "../types";
import { uploadIpfs, loadJsonFile, writeJsonFile } from "../utils";

const metadataLinks = require("../nfts/metadata/metadata.json");

const setUpMetadata = async (endersGate: EndersGate) => {
  const hashesData = Object.entries(metadataLinks).map((entry: any) => ({
    id: entry[0],
    hash: entry[1].split("/").reverse()[0],
  }));
  console.log("metadata");
  await endersGate.setIpfsHashBatch(
    hashesData.map(({ id }) => id),
    hashesData.map(({ hash }) => hash),
  );
};

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const ipfsHash = fileData?.ipfs
    ? fileData.ipfs
    : await uploadIpfs({ path: "/nfts/metadata/endersGate.json" });
  console.log("IPFS", ipfsHash.split("/").reverse()[0]);

  const endersGate = (await (
    await ethers.getContractFactory("EndersGate")
  ).deploy(
    "Enders Gate",
    "GATE",
    ipfsHash.split("/").reverse()[0],
    "https://ipfs.moralis.io:2053/ipfs/",
    {
      receiver: "0x2A441a7B86eF3466C4B78cB5A8c08c836794E2Ab",
      feeNumerator: 400,
    },
  )) as EndersGate;
  console.log("Enders Gate", endersGate.address);

  await setUpMetadata(endersGate);

  writeJsonFile({
    path: `/${fileName}`,
    data: {
      endersGate: endersGate.address,
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
