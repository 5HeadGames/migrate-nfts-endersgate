import { writeFileSync } from "fs";

const AllNfts = require("../../cards.json");
const AllNftsUpdated = require("../../cards_updated.json");

const convertArrayCards = (cards: any) => {
  let countLength = 0;
  Object.keys(cards).forEach((key, index) => {
    cards[key]?.forEach(() => {
      countLength++;
    });
  });
  const newArray: any[] = [];
  Object.keys(cards).forEach((key, index) => {
    cards[key]?.forEach((card: any, index: any) => {
      if (card.properties?.id?.value !== undefined) {
        newArray[parseInt(card.properties.id.value)] = {
          ...card,
          typeCard: key,
        };
      } else {
        newArray.push({ ...card, typeCard: key });
      }
    });
  });
  return newArray;
};

const unconvertArrayCards = (cards: any) => {
  const cardsObject: any = {
    action: [],
    reaction: [],
    iron: [],
    stone: [],
    legendary: [],
    gold: [],
    avatar: [],
    wood: [],
  };
  console.log(cards.length);

  const newArray: any[] = [];
  cards.forEach((card: any) => {
    if (card.typeCard) cardsObject[card.typeCard as any].push(card);
  });
  return cardsObject;
};

const init = async () => {
  const cards = convertArrayCards(AllNfts)
    .filter((a) => a?.typeCard !== "ghost")
    .map((a, i) => {
      const item = AllNftsUpdated[i];
      const attributes = item.attributes.filter(
        (a: any) => a.trait_type !== "image",
      );
      attributes.push({ trait_type: "image", value: item.image });
      return {
        ...a,
        image: item.image,
        properties: {
          ...item.properties,
          image: {
            name: "image",
            value: item.image,
          },
        },
        attributes: attributes,
      };
    });

  const appRoot = require("app-root-path");
  const parsedData = JSON.stringify(unconvertArrayCards(cards), null, 2);
  writeFileSync(appRoot + "/cards_new.json", parsedData);
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
