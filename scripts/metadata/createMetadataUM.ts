import { writeJsonFile } from "../../utils/index";

const AllNfts = require("../../cards_new.json");

const init = async () => {
  const allCards = Object.values(AllNfts).reduce(
    (acc: any[], cur) => acc.concat(cur),
    [],
  ) as any[];

  for (let i = 0; i <= 1500; i++) {
    writeJsonFile({
      path: "/nfts/metadata/UM/" + i,
      data: {
        name: "Ultraman Mint Pass #" + i,
        type: "ERC721",
        description:
          "A digital voucher designed to redeem a digital Ultraman Trading Card Bundle within the 5HeadGames ecosystem. Swap your official Enders Gate Mint Pass (721) tokens to official Enders Gate Trading Card (1155) tokens on the 5headGames Marketplace.",
        image:
          "https://bafybeidj5wo2przxdvs4jq7s6y5eeh4ssdleujimpjjswsak65xajorkma.ipfs.nftstorage.link/",
        symbol: "GATE",
        properties: {
          name: {
            name: "name",
            value: "Ultraman Mint Pass",
          },
          type: {
            name: "type",
            value: "Voucher",
          },
          rarity: {
            name: "rarity",
            value: "Collectors Edition",
          },
          image: {
            name: "image",
            value:
              "https://bafybeidj5wo2przxdvs4jq7s6y5eeh4ssdleujimpjjswsak65xajorkma.ipfs.nftstorage.link/",
          },
          description: {
            name: "description",
            value:
              "A digital voucher designed to redeem a digital Ultraman Trading Card Bundle within the 5HeadGames ecosystem. Swap your official Enders Gate Mint Pass (721) tokens to official Enders Gate Trading Card (1155) tokens on the 5headGames Marketplace.",
          },
        },
        attributes: [
          {
            trait_type: "name",
            value: "Ultraman",
          },
          {
            trait_type: "type",
            value: "Voucher",
          },
          {
            trait_type: "rarity",
            value: "Collectors Edition",
          },
          {
            trait_type: "image",
            value:
              "https://bafybeidj5wo2przxdvs4jq7s6y5eeh4ssdleujimpjjswsak65xajorkma.ipfs.nftstorage.link/",
          },
          {
            trait_type: "description",
            value:
              "A digital voucher designed to redeem a digital Ultraman Trading Card Bundle within the 5HeadGames ecosystem. Swap your official Enders Gate Mint Pass (721) tokens to official Enders Gate Trading Card (1155) tokens on the 5headGames Marketplace.",
          },
        ],
        typeCard: "Voucher",
      },
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
