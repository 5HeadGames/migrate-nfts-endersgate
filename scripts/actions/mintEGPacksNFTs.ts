import { ethers, network } from "hardhat";
import fs from "fs";
import { loadJsonFile } from "../../utils";
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

  const NFTsToMint = [
    { balance: 100, id: 0 },
    { balance: 100, id: 1 },
    { balance: 100, id: 2 },
    { balance: 100, id: 3 },
  ];

  const tx = await endersPacks.mintBatch(
    _accounts[0].address,
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
