import { writeJsonFile } from "../utils/index";

const AllNfts = require("../cards.json");

const init = async () => {
  const allCards = Object.values(AllNfts).reduce(
    (acc: any[], cur) => acc.concat(cur),
    [],
  ) as any[];
  const cardsMetadata = {} as Record<number, string>;

  for await (let card of allCards) {
    console.log(card);
    writeJsonFile({
      path: "/nfts/metadata/EndersGate/" + card.properties.id.value,
      data: card,
    });
  }
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
