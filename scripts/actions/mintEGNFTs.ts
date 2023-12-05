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
    { balance: 1, id: 7 },
    { balance: 1, id: 67 },
    { balance: 1, id: 95 },
    { balance: 1, id: 160 },
    { balance: 1, id: 165 },
    { balance: 1, id: 230 },
  ];

  const tx = await endersGate.mintBatch(
    "0xF5eD9f2E49E7aa8FdFA4Ea18bd1477D7131ee674",
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
