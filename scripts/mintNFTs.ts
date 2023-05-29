import { ethers, network } from "hardhat";
import fs from "fs";
import { EndersBattlePass } from "../types";
import { loadJsonFile } from "../utils";
// import { ClockSaleOwnable } from "../typechain";

async function main() {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [EndersGate, EndersPack, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersGate"),
    ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: fileData.library,
      },
    }),
    ethers.getSigners(),
  ]);

  const addresToCheck = "0xf702999663506d07c5D17932DC682f7108ca3695";

  const endersGate = await EndersGate.attach(fileData.endersGate);
  const endersPack = await EndersPack.attach(fileData.pack);

  const balanceCards = await endersGate.balanceOfBatch(
    new Array(234).fill(addresToCheck),
    new Array(234).fill(false).map((e, i) => i),
  );

  const balancePacks = await endersPack.balanceOfBatch(
    new Array(4).fill(addresToCheck),
    new Array(4).fill(false).map((e, i) => i),
  );

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
