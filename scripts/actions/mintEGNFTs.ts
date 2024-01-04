import { ethers, network } from "hardhat";
import fs from "fs";
import { loadJsonFile } from "../../utils";
// import { ClockSaleOwnable } from "../typechain";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [EndersGate, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersGate"),

    ethers.getSigners(),
  ]);

  const endersGate = EndersGate.attach(fileData.endersGate);

  const NFTsToMint = [{ balance: 1, id: 215 }];

  const tx = await endersGate.mintBatch(
    "0xB041249830Cfaa30F177290091Ff564BDb59FcdB",
    NFTsToMint.map(({ id }) => id),
    NFTsToMint.map(({ balance }) => balance),
    "0x00",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
