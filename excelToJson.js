const ExcelJS = require("exceljs");
const {writeJsonFile} = require("./utils/index");

const workbook = new ExcelJS.Workbook();

const formatCardData = (data) => {
  return {
    name: data.name,
    type: "ERC1155",
    description: data.description,
    image: "",
    symbol: "GATE",
    properties: Object.entries(data).reduce(
      (acc, cur) => ({
        ...acc,
        [cur[0]]: {
          name: cur[0],
          value: cur[1],
        },
      }),
      {}
    ), //erc1155 standard for properties
    attributes: Object.entries(data).map((entry) => ({
      trait_type: entry[0],
      value: entry[1],
    })), //opensea standard
  };
};

const init = async () => {
  await workbook.xlsx.readFile("cards.xlsx");
  let cards = {};

  workbook.worksheets.forEach((sheet, i) => {
    if (i <= 0) return;
    sheet.eachRow((row, j) => {
      if (j <= 3) return;
      const index = sheet.name.toLowerCase();
      const {values} = row;
      if (i == 1 || i == 2) {
        //action/reaction cards
        const insertValue = formatCardData({
          id: values[1],
          name: values[2],
          type: values[3],
          ADOTurn: values[4],
          rarity: values[5],
          description: values[6],
          image: values[7],
        });
        if (Array.isArray(cards[index])) cards[index].push(insertValue);
        else cards[index] = [insertValue];
      } else if (i < 8) {
        //omit avatars
        const insertValue = formatCardData({
          id: values[1],
          name: values[2],
          element: values[3],
          role: values[4],
          race: values[5],
          attack: values[6],
          hp: values[7],
          gold: values[8],
          description: values[9],
          duplicates: values[10] || 0,
          image: values[11] || 0,
        });
        if (Array.isArray(cards[index])) cards[index].push(insertValue);
        else cards[index] = [insertValue];
      }
    });
  });

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
