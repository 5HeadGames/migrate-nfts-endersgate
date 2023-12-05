import { ethers, network } from "hardhat";
import fs from "fs";
import { loadJsonFile } from "../../utils";
// import { ClockSaleOwnable } from "../typechain";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [EndersGate, EndersPack, Marketplace, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersGate"),
    ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: fileData.library,
      },
    }),
    ethers.getContractFactory("ClockSale"),
    ethers.getSigners(),
  ]);

  console.log("test", fileData, network.name);

  const addresToCheck = "0xC445da50851D84522a95a6574544698bC0951754";

  const endersGate = await EndersGate.attach(fileData.endersGate);
  const endersPack = await EndersPack.attach(fileData.pack);
  const marketplace = await Marketplace.attach(fileData.marketplace);

  const balanceCards = await endersGate.balanceOfBatch(
    new Array(234).fill(addresToCheck),
    new Array(234).fill(false).map((e, i) => i),
  );

  const balancePacks = await endersPack.balanceOfBatch(
    new Array(4).fill(addresToCheck),
    new Array(4).fill(false).map((e, i) => i),
  );

  // const sales = marketplace.

  console.log(
    balanceCards
      .map((i, id) => {
        return { balance: i, id: id };
      })
      .filter((i) => i.balance.toNumber() > 0),
    balancePacks
      .map((i, id) => {
        return { balance: i, id: id };
      })
      .filter((i) => i.balance.toNumber() > 0),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
