import { ethers, network } from "hardhat";
import { writeJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `/addresses/addresses.${network.name}.json`;

  const test = await (await ethers.getContractFactory("Test")).deploy();

  writeJsonFile({
    path: `${fileName}`,
    data: {
      test: test.address,
    },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
