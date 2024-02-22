import { ethers, network } from "hardhat";
import { writeJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;

  const endersGate = await (
    await ethers.getContractFactory("EndersGateSBNFT")
  ).deploy(
    "Enders Gate SoulBounds",
    "EGSBT",
    "QmXWojzVzRo2NERK3LtrscCXwJ5CrZ8xbnchTgWnTyLDvw",
    "https://bafybeifuewinbl3swoudeqxw4n3cnczuz7ndyfvgbiyg56smgixxeimbl4.ipfs.nftstorage.link/",
  );

  writeJsonFile({
    path: `/addresses/${fileName}`,
    data: {
      SBT: endersGate.address,
    },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
