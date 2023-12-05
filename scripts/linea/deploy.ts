import { ethers, network } from "hardhat";
import { writeJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;

  const endersGate = await (
    await ethers.getContractFactory("EndersGate")
  ).deploy(
    "Enders Gate",
    "GATE",
    "QmXWojzVzRo2NERK3LtrscCXwJ5CrZ8xbnchTgWnTyLDvw",
    "https://bafybeiet45o4vajmbtlk4qlmcg6tpymup2mybld2noqlsdegcxmlro6cnu.ipfs.nftstorage.link/",
    {
      receiver: "0x2A441a7B86eF3466C4B78cB5A8c08c836794E2Ab",
      feeNumerator: 400,
    },
  );

  writeJsonFile({
    path: `/addresses/${fileName}`,
    data: {
      endersGate: endersGate.address,
    },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
