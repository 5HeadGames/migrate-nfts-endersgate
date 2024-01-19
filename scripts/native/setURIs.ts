import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";

const init = async () => {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const RentMultiTokens = await ethers.getContractFactory("EndersRentNative");
  const rent = RentMultiTokens.attach(fileData.rent);

  const tx = await rent.setIpfsHashBatch(
    new Array(233).fill(0).map((a, i) => i),
    new Array(233)
      .fill(0)
      .map(
        (a, i) =>
          "https://bafybeieenjajydhpudrrju3dbb74i36s7pcu2egnraqp63eq3lndobx64m.ipfs.nftstorage.link/" +
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
