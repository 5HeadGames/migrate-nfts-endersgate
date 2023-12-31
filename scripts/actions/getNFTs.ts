import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const addressToCheck = "0x6a5Adc59e769044B16314097e76EBE3F27794A5a";

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

  const marketplace = (await ethers.getContractFactory("ClockSale")).attach(
    fileData.marketplace,
  );

  // const endersPacks = (await ethers.getContractFactory("EndersGate")).attach(
  //   fileData.pack,
  // );

  const sales = new Array(1000).fill(1 as any).map((a, i) => i);

  // const addresstoGetPacks = new Array(4).fill(addressToCheck);
  // const idsPacks = new Array(4).fill(1).map((a, id) => id);

  console.log(
    "SALES",
    (await marketplace.getSales(sales))
      .map(({ seller, nftId, amount, status }) => {
        return { seller, nftId, amount, status };
      })
      .filter(({ seller, status }) => {
        return (
          seller.toLowerCase() == addressToCheck.toLowerCase() && status == 0
        );
      }),
  );

  const endersGate = (await ethers.getContractFactory("EndersGate")).attach(
    fileData.endersGate,
  );

  const endersPacks = (await ethers.getContractFactory("EndersGate")).attach(
    fileData.pack,
  );

  const addresstoGetCards = new Array(234).fill(addressToCheck);
  const idsCards = new Array(234).fill(1).map((a, id) => id);

  const addresstoGetPacks = new Array(4).fill(addressToCheck);
  const idsPacks = new Array(4).fill(1).map((a, id) => id);

  console.log(
    "CARDS",
    (await endersGate.balanceOfBatch(addresstoGetCards, idsCards))
      .map((balance, id) => {
        return { balance: Number(balance), id };
      })
      .filter(({ balance }) => {
        return balance > 0;
      }),
  );

  console.log(
    "PACKS",
    (await endersPacks.balanceOfBatch(addresstoGetPacks, idsPacks))
      .map((balance, id) => {
        return { balance: Number(balance), id };
      })
      .filter(({ balance }) => {
        return balance > 0;
      }),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
