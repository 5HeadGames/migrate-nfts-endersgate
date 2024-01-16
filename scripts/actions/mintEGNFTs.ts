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
    { balance: 1, id: 8 },
    { balance: 1, id: 54 },
    { balance: 1, id: 157 },
    { balance: 1, id: 172 },
    { balance: 1, id: 181 },
    { balance: 1, id: 230 },
  ];

  const tx = await endersGate.mintBatch(
    "0x0ccebBb258c22224b6f046A2Be9c488E25ab5Bc0",
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
