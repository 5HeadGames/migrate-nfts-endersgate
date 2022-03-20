import hardhat from "hardhat";
import {writeJsonFile, uploadIpfsObject} from "../utils/index";

const AllNfts = require("../cards.json");

const init = async () => {
  const allCards = Object.values(AllNfts).reduce((acc: any[], cur) => acc.concat(cur), []) as any[];
  const cardsMetadata = {} as Record<number, string>

  for await (let card of allCards) {
    if (card.image.length <= 0)
      continue;
    const id = card.properties.id.value
    const ipfsHash = await uploadIpfsObject({element: card, name: card.name})
    cardsMetadata[id] = ipfsHash
  }

  writeJsonFile({
    path: "/nfts/metadata/metadata.json",
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
