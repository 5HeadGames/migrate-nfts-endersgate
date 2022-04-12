const {uploadIpfs, uploadIpfsObject, writeJsonFile, loadJsonFile} = require("../utils");
const {formatCardData} = require("../utils/cards");

const removeUndefined = (object) => {
  const keys = Object.keys(object);
  keys.forEach((key) => object[key] === undefined && delete object[key]);
  return object;
};

task("create-nft", "Upload image to ipfs")
  .addParam("name", "Card name")
  .addParam("image", "Image path")
  .addParam("group", "Group on which the card belongs")
  .addOptionalParam("type", "Fire")
  .addOptionalParam("rarity", "rarity, duh")
  .addOptionalParam("description", "description")
  .setAction(async (taskArgs, hardhat) => {
    const {name, type, rarity, image, group, description} = taskArgs;
    const {ethers, network} = hardhat;
    const fileName = `addresses.${network.name}.json`;
    const fileData = loadJsonFile(fileName);
    console.log(fileName, fileData);
    const metadataIPFS = loadJsonFile("nfts/metadata/metadata.json");
    const lastId =
      Object.keys(metadataIPFS)
        .map((id) => Number(id))
        .sort((a, b) => b - a)[0] + 1;
    const imageIpfs = await uploadIpfs({path: image});
    const cardData = formatCardData(
      removeUndefined({name, type, rarity, image: imageIpfs, description})
    );
    const dataIpfs = await uploadIpfsObject({element: cardData, name});

    writeJsonFile({
      path: "/nfts/metadata/metadata.json",
      data: {
        [lastId]: dataIpfs,
      },
    });
    writeJsonFile({
      path: "/cards.json",
      data: (prevData) => ({
        ...prevData,
        ...{
          [group]: prevData[group] ? [...prevData[group], cardData] : [cardData],
        },
      }),
    });

    const nfts = (await ethers.getContractFactory("EndersGate")).attach(fileData.endersGate);
    await nfts.setIpfsHashBatch([lastId], [dataIpfs.split("/").reverse()[0]]);
    console.log("SUCCESS", [lastId], [dataIpfs.split("/").reverse()[0]]);
  });
