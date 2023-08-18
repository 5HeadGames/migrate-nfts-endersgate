import { ethers, network } from "hardhat";
import { loadJsonFile, writeJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `/addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const test = await (
    await ethers.getContractFactory("Test")
  ).attach(fileData.test);

  await test.setString("a");

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
