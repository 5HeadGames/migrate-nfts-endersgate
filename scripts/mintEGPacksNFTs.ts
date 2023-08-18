import { ethers, network } from "hardhat";
import fs from "fs";
import { EndersBattlePass } from "../types";
import { loadJsonFile } from "../utils";
// import { ClockSaleOwnable } from "../typechain";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [EndersPacks, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: fileData.library,
      },
    }),

    ethers.getSigners(),
  ]);

  const endersPacks = EndersPacks.attach(fileData.pack);

  const tx = await endersPacks.mintBatch(
    "0x40f75fb842e9001390bb11E89D02991E838095A7",
    [0, 1, 2, 3],
    [1000, 1000, 1000, 1000],
    "0x00",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
