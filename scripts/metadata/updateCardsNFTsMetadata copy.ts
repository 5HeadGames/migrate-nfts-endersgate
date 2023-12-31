import { writeJsonFile } from "../../utils";
import { writeFileSync } from "fs";

const AllNfts = require("../../cards.json");

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

const init = async () => {
  const client = new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRiNjMwZEI5OTMwNWU4Q2M3ZjQxQzFiOTEzNTlCNUEyMDI4OTYxMTYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTQwOTg0MDE4NzIsIm5hbWUiOiJlbmRlcnNnIn0.vpHXhTvikwns1_GUwD4pQwpk0-JCNYLcH2DEGk9CXpo",
  });

  const uploadItems = [];
  for await (const item of client.list({ maxResults: 250 })) {
    if (new Date(item.created).getTime() > new Date(2023, 9, 30).getTime()) {
      uploadItems.push(item);
    }
  }

  const itemsFiltered = uploadItems.map((item) => {
    return {
      ...item,
      name: item.name
        .replace("FRONT", "")
        .replace(".webp", "")
        .replace("'", ""),
      fileName: item.name,
    };
  });

  const cards = convertArrayCards(AllNfts).map((a) => {
    const item: any = itemsFiltered.find((item) => {
      if (item.name != "EARTH") {
        return a.name
          .toLocaleLowerCase()
          .replace("'", "")
          .replace(":", "")
          .includes(item.name.toLocaleLowerCase());
      } else {
        return a.name.toLocaleLowerCase().includes("earth blood");
      }
    });
    console.log(item);
    return {
      ...a,
      image: item
        ? `https://${item.cid}.ipfs.dweb.link/${item.fileName.replaceAll(
            " ",
            "%20",
          )}`
        : a.image,
    };
  });

  const appRoot = require("app-root-path");
  const parsedData = JSON.stringify(cards, null, 2);
  writeFileSync(appRoot + "/cards_updated.json", parsedData);
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
