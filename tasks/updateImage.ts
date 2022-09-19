import {task} from "hardhat/config";

import {uploadIpfs, uploadIpfsObject, writeJsonFile, loadJsonFile, getUrlHash} from "../utils";
import cards from "../cards.json";

const updateMetadata = (metadata: any, {imageUri}: {imageUri: string}) => {
  const imageCID = getUrlHash(imageUri);
  const attributeIndex = metadata.attributes.findIndex((att: any) => att.trait_type === "image");

  metadata.image = imageCID;
  metadata.properties.image.value = imageUri;
  metadata.attributes[attributeIndex].value = imageUri;

  return metadata;
};

task("update-image", "Update nft image")
  .addParam("id", "nft id")
  .addParam("image", "Image path")
  .setAction(async (taskArgs, hre) => {
    const {id, image} = taskArgs;
    const {ethers} = hre;

    const cardList = Object.values(cards).reduce((acc: any[], cur) => acc.concat(cur), [] as any[]);
    const cardIndex = cardList.findIndex((card) => card.properties.id.value === Number(id));

    let cardMetadata = cardList[cardIndex];
    const ipfs = await uploadIpfs({path: image});

    cardMetadata = updateMetadata(cardMetadata, {imageUri: ipfs});

    const cid = getUrlHash(
      await uploadIpfsObject({
        element: cardMetadata,
        name: cardMetadata.name,
      })
    );
    const cardsContract = (await ethers.getContractFactory("EndersGate")).attach(
      "0xAd6f94bDefB6D5ae941392Da5224ED083AE33adc" //harmony
    );

    const {hash} = await cardsContract.setIpfsHashBatch([id], [cid]);
    console.log("SUCCESS", {hash, cid, image: getUrlHash(ipfs)});
  });
