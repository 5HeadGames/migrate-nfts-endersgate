import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";

const init = async () => {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const RentMultiTokens = await ethers.getContractFactory("RentMultiTokens");
  const rent = RentMultiTokens.attach(fileData.rent);

  const tx = await rent.setIpfsHashBatch(
    new Array(100).fill(0).map((a, i) => i),
    new Array(100)
      .fill(0)
      .map(
        (a, i) =>
          "https://bafybeiet45o4vajmbtlk4qlmcg6tpymup2mybld2noqlsdegcxmlro6cnu.ipfs.nftstorage.link/" +
          i,
      ),
  );
  console.log(await tx.wait());
};

init()
  .then(() => {
    console.log("SUCCESS");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
