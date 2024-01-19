import { writeJsonFile } from "../../utils/index";

const AllNfts = require("../../cards_new.json");

const init = async () => {
  const allCards = Object.values(AllNfts).reduce(
    (acc: any[], cur) => acc.concat(cur),
    [],
  ) as any[];

  for await (let card of allCards) {
    if (card?.properties?.id) {
      writeJsonFile({
        path: "/nfts/metadata/EGJson/" + card.properties.id.value,
        data: card,
      });
    }
  }
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
