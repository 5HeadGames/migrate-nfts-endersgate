import hardhat from "hardhat";
import {writeJsonFile, uploadIpfsObject} from "../utils/index";

const AllPacks = require('../packs.json')

const init = async () => {
  const allCards = Object.values(AllPacks) as any[]
  const cardsMetadata = {} as Record<number, string>;

  for await (let card of allCards) {
    const id = card.properties.id.value;
    const ipfsHash = await uploadIpfsObject({element: card, name: card.name});
    cardsMetadata[id] = ipfsHash;
  }

  writeJsonFile({
    path: "/nfts/metadata/packsMetadata.json",
    data: cardsMetadata,
  });
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
