import { ethers, network, upgrades } from "hardhat";

import { EndersGate, EndersPack } from "../types";
import { uploadIpfs, loadJsonFile, writeJsonFile, wait } from "../utils";
import { getPacksConfig, PacksConfig } from "../utils/packs";
import { attach } from "../utils/contracts";

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
  const tx = await endersGate.grantRole(
    await endersGate.SUPPLY_ROLE(),
    pack.address,
  );
  console.log("MINTER ROLE", tx.hash);

  const tx2 = await pack.setState(
    endersGate.address,
    packsConfig.NUM_CARDS,
    packsConfig.NUM_TYPES,
    5,
  );
  console.log("CONFIG", tx2.hash);

  console.log({ configLength: packsConfig.cards.length });
  for await (let i of packsConfig.cards) {
    console.log({ length: i.types.length });
    await wait(2000);
    await pack.setOptionSettings(
      i.id,
      i.mintLimit,
      i.types.map(({ id }) => id),
      i.types.map(({ inferiorLimit }) => inferiorLimit),
      i.types.map(({ superiorLimit }) => superiorLimit),
    );
  }
  console.log("CARDS");

  for await (let i of packsConfig.types) {
    await pack.setTokensForTypes(i.id, i.nftsIds);
    console.log(i.id, i.nftsIds);
  }
  console.log("TYPES");

  // const hashesData = Object.entries(metadataLinks).map((entry: any) => ({
  //   id: entry[0],
  //   hash: entry[1].split("/").reverse()[0],
  // }));
  // await pack.setIpfsHashBatch(
  //   hashesData.map(({ id }) => id),
  //   hashesData.map(({ hash }) => hash),
  // );
  console.log("HASHES");
};

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const packsConfig = getPacksConfig();

  const ipfsHash = fileData?.packIpfs
    ? fileData.packIpfs
    : await uploadIpfs({ path: "/nfts/metadata/packs.json" });
  console.log("IPFS", ipfsHash.split("/").reverse()[0]);

  const endersGate: EndersGate = (
    await ethers.getContractFactory("EndersGate")
  ).attach(fileData.endersGate);

  const library = await (
    await ethers.getContractFactory("LootBoxRandomness")
  ).deploy();
  console.log("Library", library.address);

  //const pack = (
  //await ethers.getContractFactory("EndersPack", {
  //libraries: {
  //LootBoxRandomness: library.address,
  ////LootBoxRandomness: endersGate.address,
  //},
  //})
  //).attach(fileData.packs);
  const pack = await (
    await ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: library.address,
      },
    })
  ).deploy(
    "https://nft.xp.network/w/12/0xb90Dc9e354001e6260DE670EDD6aBaDb890C6aC9/",
  );
  // ).deploy("https://ipfs.moralis.io:2053/ipfs/");
  console.log("Pack", pack.address);

  console.log("setPacksState");
  await setPacksState({ pack, packsConfig, endersGate });

  writeJsonFile({
    path: `/${fileName}`,
    data: { pack: pack.address, packIpfs: ipfsHash, library: library.address },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
