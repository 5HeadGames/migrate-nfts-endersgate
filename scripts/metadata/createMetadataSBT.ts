import { ethers } from "ethers";
import { hash, writeJsonFile } from "../../utils/index";

const AllNfts = require("../../cards_new.json");

const init = async () => {
  const allCards = Object.values(AllNfts).reduce(
    (acc: any[], cur) => acc.concat(cur),
    [],
  ) as any[];

  writeJsonFile({
    path:
      "/sbts/metadata/" +
      ethers.BigNumber.from(hash("game.level.three").toString()).toString(),
    data: {
      name: "Linea Park Keeper",
      type: "ERC1155",
      description:
        "Obtained by playing the Enders Gate Arena Game Mode during the Linea Park Voyage Event and Earning XP from Consensys.",
      image:
        "https://bafkreigupzegs6gur2ln5bu3ibailqik6or4zci3xivfomemebagsnmkkm.ipfs.nftstorage.link/",
      symbol: "GATE",
      properties: {
        id: {
          name: "id",
          value: 0,
        },
        name: {
          name: "name",
          value: "Linea Park Keeper",
        },
        type: {
          name: "type",
          value: "Normal Action",
        },
        ADOTurn: {
          name: "ADOTurn",
          value: "NO",
        },
        rarity: {
          name: "rarity",
          value: "Rare",
        },
        description: {
          name: "description",
          value:
            "Obtained by playing the Enders Gate Arena Game Mode during the Linea Park Voyage Event and Earning XP from Consensys.",
        },
        image: {
          name: "image",
          value:
            "https://bafkreigupzegs6gur2ln5bu3ibailqik6or4zci3xivfomemebagsnmkkm.ipfs.nftstorage.link/",
        },
      },
      attributes: [
        {
          trait_type: "id",
          value: 0,
        },
        {
          trait_type: "name",
          value: "Linea Park Keeper",
        },
        {
          trait_type: "type",
          value: "Normal Action",
        },
        {
          trait_type: "ADOTurn",
          value: "NO",
        },
        {
          trait_type: "rarity",
          value: "Rare",
        },
        {
          trait_type: "description",
          value:
            "Obtained by playing the Enders Gate Arena Game Mode during the Linea Park Voyage Event and Earning XP from Consensys.",
        },
        {
          trait_type: "image",
          value:
            "https://bafkreigupzegs6gur2ln5bu3ibailqik6or4zci3xivfomemebagsnmkkm.ipfs.nftstorage.link/",
        },
      ],
      typeCard: "action",
    },
  });

  writeJsonFile({
    path:
      "/sbts/metadata/" +
      ethers.BigNumber.from(hash("game.duel.first").toString()).toString(),
    data: {
      name: "My First Duel",
      type: "ERC1155",
      description: "Obtained by completing a match in the Arena Game Mode.",
      image:
        "https://bafkreiab2hf2aeevzmihgzoe4hrbl25pvsb6avjvt6gpyaowbynfdmfgnu.ipfs.nftstorage.link/",
      symbol: "GATE",
      properties: {
        id: {
          name: "id",
          value: 0,
        },
        name: {
          name: "name",
          value: "My First Duel",
        },
        type: {
          name: "type",
          value: "Normal Action",
        },
        ADOTurn: {
          name: "ADOTurn",
          value: "NO",
        },
        rarity: {
          name: "rarity",
          value: "Rare",
        },
        description: {
          name: "description",
          value:
            "Obtained by completing a match in the Arena Game Mode.Obtained by completing a match in the Arena Game Mode.",
        },
        image: {
          name: "image",
          value:
            "https://bafkreiab2hf2aeevzmihgzoe4hrbl25pvsb6avjvt6gpyaowbynfdmfgnu.ipfs.nftstorage.link/",
        },
      },
      attributes: [
        {
          trait_type: "id",
          value: 0,
        },
        {
          trait_type: "name",
          value: "My First Duel",
        },
        {
          trait_type: "type",
          value: "Normal Action",
        },
        {
          trait_type: "ADOTurn",
          value: "NO",
        },
        {
          trait_type: "rarity",
          value: "Rare",
        },
        {
          trait_type: "description",
          value: "Obtained by completing a match in the Arena Game Mode.",
        },
        {
          trait_type: "image",
          value:
            "https://bafkreiab2hf2aeevzmihgzoe4hrbl25pvsb6avjvt6gpyaowbynfdmfgnu.ipfs.nftstorage.link/",
        },
      ],
      typeCard: "action",
    },
  });
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
