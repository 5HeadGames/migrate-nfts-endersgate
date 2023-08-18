import { ethers, network } from "hardhat";
import fs from "fs";
import { EndersBattlePass } from "../types";
import { loadJsonFile } from "../utils";
// import { ClockSaleOwnable } from "../typechain";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [EndersGate, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersGate"),

    ethers.getSigners(),
  ]);

  const endersGate = EndersGate.attach(fileData.endersGate);

  const tx = await endersGate.mintBatch(
    "0xc2B8Abc5249397DB5d159b4E3c311c2fAf4091f2",
    [215, 230],
    [2, 4],
    "0x00",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
