import { ethers, network } from "hardhat";
import { loadJsonFile } from "../utils";

async function main(): Promise<void> {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const addressToCheck = "0xc2B8Abc5249397DB5d159b4E3c311c2fAf4091f2";

  if (network.name === "harmony") {
    const dracul = (await ethers.getContractFactory("ERC1155card")).attach(
      fileData.dracul,
    );
    const eross = (await ethers.getContractFactory("ERC1155card")).attach(
      fileData.eross,
    );
    console.log("DRACUL:", await dracul.balanceOf(addressToCheck, 1));
    console.log("EROSS:", await eross.balanceOf(addressToCheck, 1));
  }
  const endersGate = (await ethers.getContractFactory("EndersGate")).attach(
    fileData.endersGate,
  );

  // const endersPacks = (await ethers.getContractFactory("EndersGate")).attach(
  //   fileData.pack,
  // );

  const addresstoGetCards = new Array(234).fill(addressToCheck);
  const idsCards = new Array(234).fill(1).map((a, id) => id);

  // const addresstoGetPacks = new Array(4).fill(addressToCheck);
  // const idsPacks = new Array(4).fill(1).map((a, id) => id);

  console.log(
    "CARDS",
    (await endersGate.balanceOfBatch(addresstoGetCards, idsCards))
      .map((balance, id) => {
        return { balance, id };
      })
      .filter(({ balance }) => {
        return balance.toNumber() > 0;
      }),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
