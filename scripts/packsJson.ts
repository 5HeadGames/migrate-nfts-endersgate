import hardhat from "hardhat";
import {writeJsonFile, uploadIpfs} from "../utils/index";

type PackType = "common" | "rare" | "epic" | "legendary";
const packTypes: PackType[] = ["common", "rare", "epic", "legendary"];

const formatCardData = ({type, imageURL}: {type: PackType; imageURL: string}) => {
  const id = packTypes.findIndex((t) => t === type);
  const hash = imageURL.split("/").reverse()[0];
  return {
    name: `${type} Pack`,
    type: "ERC1155",
    description: `Enders Gate ${type} pack`,
    image: hash,
    symbol: "PACK",
    properties: {
      id: {
        name: "id",
        value: id,
      },
      name: {
        name: "name",
        value: `${type} pack`,
      },
      description: {
        name: "description",
        value: `Enders Gate ${type} pack`,
      },
      image: {
        name: "image",
        value: imageURL,
      },
    },
    attributes: [
      {
        trait_type: "id",
        value: id,
      },
      {
        trait_type: "name",
        value: `${type} pack`,
      },
      {
        trait_type: "description",
        value: `Enders Gate ${type} pack`,
      },
      {
        trait_type: "image",
        value: imageURL,
      },
    ],
  };
};

const init = async () => {
  let packs: Partial<Record<PackType, any>> = {};

  for await (let type of packTypes) {
    const path = `/nfts/images/packs/${type}.png`;
    const imageURL = await uploadIpfs({path});
    packs[type] = formatCardData({imageURL, type});
  }

  console.log(packs);
  writeJsonFile({
    path: "/packs.json",
    data: packs,
  });
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
