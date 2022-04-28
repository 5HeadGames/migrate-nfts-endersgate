import {ethers, network, upgrades} from "hardhat";

import {EndersGate, EndersPack} from "../types";
import {uploadIpfs, loadJsonFile, writeJsonFile} from "../utils";
import {getPacksConfig, PacksConfig} from "../utils/packs";

const metadataLinks = require("../nfts/metadata/packsMetadata.json");

const setPacksState = async ({
  pack,
  packsConfig,
  endersGate,
}: {
  pack: EndersPack;
  packsConfig: PacksConfig;
  endersGate: EndersGate;
}) => {
  await endersGate.grantRole(await endersGate.MINTER_ROLE(), pack.address);
  console.log("MINTER ROLE");

  await pack.setState(endersGate.address, packsConfig.NUM_CARDS, packsConfig.NUM_TYPES, 5);
  console.log("CONFIG");

  for await (let i of packsConfig.cards) {
    await pack.setOptionSettings(
      i.id,
      i.mintLimit,
      i.types.map(({id}) => id),
      i.types.map(({inferiorLimit}) => inferiorLimit),
      i.types.map(({superiorLimit}) => superiorLimit)
    );
  }
  console.log("CARDS");

  for await (let i of packsConfig.types) await pack.setTokensForTypes(i.id, i.nftsIds);
  console.log("TYPES");

  const hashesData = Object.entries(metadataLinks).map((entry: any) => ({
    id: entry[0],
    hash: entry[1].split("/").reverse()[0],
  }));
  await pack.setIpfsHashBatch(
    hashesData.map(({id}) => id),
    hashesData.map(({hash}) => hash)
  );
  console.log("HASHES");
};

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const packsConfig = getPacksConfig();
  console.log({fileData});

  const ipfsHash = fileData?.packIpfs
    ? fileData.packIpfs
    : await uploadIpfs({path: "/nfts/metadata/packs.json"});
  console.log("IPFS", ipfsHash.split("/").reverse()[0]);

  const endersGate: EndersGate = (await ethers.getContractFactory("EndersGate")).attach(
    fileData.endersGate
  );

  const library = await (await ethers.getContractFactory("LootBoxRandomness")).deploy();
  console.log("Library", library.address);

  const pack = await (
    await ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: library.address,
      },
    })
  ).deploy(
    "Enders Gate Pack",
    "PACK",
    ipfsHash.split("/").reverse()[0],
    "https://ipfs.moralis.io:2053/ipfs/"
  );
  console.log("Pack", pack.address);

  await setPacksState({pack, packsConfig, endersGate});

  writeJsonFile({
    path: `/${fileName}`,
    data: {pack: pack.address, packIpfs: ipfsHash, library: library.address},
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
