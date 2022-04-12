import hardhat from "hardhat";
import {writeJsonFile, uploadIpfs} from "../utils/index";
import {formatCardData} from "../utils/cards";

const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();

const init = async () => {
  await workbook.xlsx.readFile("cards.xlsx");
  let cards = {} as Record<string, any>;
  let cardId = 0;

  workbook.worksheets.forEach((sheet: any, i: number) => {
    if (i <= 0) return;
    sheet.eachRow((row: any, j: number) => {
      if (j <= 3) return;
      const index = sheet.name.toLowerCase();
      const {values} = row;
      if (i == 1 || i == 2) {
        //action/reaction cards
        const insertValue = formatCardData({
          id: cardId++,
          name: values[2],
          type: values[3],
          ADOTurn: values[4],
          rarity: values[5],
          description: values[6],
          image: `${index}.${values[2].toUpperCase()}`,
        });
        if (Array.isArray(cards[index])) cards[index].push(insertValue);
        else cards[index] = [insertValue];
      } else if (i < 8) {
        //omit avatars
        if (values[2] === undefined) return;

        const insertValue = formatCardData({
          id: cardId++,
          name: values[2],
          element: values[3],
          role: values[4],
          race: values[5],
          attack: values[6],
          hp: values[7],
          gold: values[8],
          description: values[9],
          duplicates: values[10] || 0,
          image: `${index}.${values[2].toUpperCase()}`,
        });
        if (Array.isArray(cards[index])) cards[index].push(insertValue);
        else cards[index] = [insertValue];
      }
    });
  });

  const allCards = Object.values(cards).reduce((acc: any[], cur) => acc.concat(cur), []);
  for await (let cardType of allCards) {
    try {
      const [type, fileName] = [
        cardType.image.split(".")[0],
        cardType.image.split(".").slice(1).join("."),
      ];
      const path = `/nfts/images/${cardType.image.replace(".", "/")}.png`;
      const ipfs = await uploadIpfs({path});
      const id = cardType.properties.id.value;
      const index = cards[type].findIndex((card: any) => Number(card.properties.id.value) === id);
      const traitImageIndex = cards[type][index].attributes.findIndex(
        ({trait_type}: any) => trait_type === "image"
      );

      cards[type][index].image = ipfs.split("/").reverse()[0];
      cards[type][index].properties.image.value = ipfs;
      cards[type][index].attributes[traitImageIndex].value = ipfs;
    } catch (err: any) {
      console.log("WEIRD ERROR", cardType.properties.id.value, err.message);
    }
  }

  writeJsonFile({
    path: "/cards.json",
    data: cards,
  });
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
