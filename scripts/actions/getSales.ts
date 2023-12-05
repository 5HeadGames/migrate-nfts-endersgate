import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const addressToCheck = "0xC45Ab7cdBCc9f7A7AEbB61a4540492F5Ee55Ec90";

  const marketplace = (await ethers.getContractFactory("ClockSale")).attach(
    fileData.marketplace,
  );

  // const endersPacks = (await ethers.getContractFactory("EndersGate")).attach(
  //   fileData.pack,
  // );

  const sales = new Array(750).fill(1 as any).map((a, i) => i);

  // const addresstoGetPacks = new Array(4).fill(addressToCheck);
  // const idsPacks = new Array(4).fill(1).map((a, id) => id);

  console.log(
    "CARDS",
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
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
