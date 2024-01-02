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

  const NFTsToMint = [
    { balance: 1, id: 5 },
    { balance: 1, id: 10 },
    { balance: 1, id: 20 },
    { balance: 1, id: 64 },
    { balance: 1, id: 65 },
    { balance: 1, id: 68 },
    { balance: 1, id: 79 },
    { balance: 1, id: 80 },
    { balance: 1, id: 83 },
    { balance: 1, id: 144 },
    { balance: 1, id: 149 },
    { balance: 1, id: 150 },
    { balance: 1, id: 180 },
    { balance: 1, id: 192 },
    { balance: 1, id: 208 },
    { balance: 2, id: 215 },
    { balance: 1, id: 230 },
    { balance: 2, id: 231 },
    { balance: 1, id: 232 },
  ];

  const tx = await endersGate.mintBatch(
    "0x6618af3Fe00C0eC3DE8cf3e62d65ef4e01D11759",
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
