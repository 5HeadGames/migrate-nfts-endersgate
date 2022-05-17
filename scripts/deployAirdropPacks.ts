import hre, {ethers, network} from "hardhat";

import {EndersGate, PacksAirdrop} from "../types";
import {attach, deploy} from "../utils/contracts";
import {configureAirdrop} from "../utils/airdrop";
import {loadJsonFile, writeJsonFile} from "../utils";

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const endersGate = <EndersGate>await attach(hre, "EndersGate", fileData.endersGate);
  const airdrop = <PacksAirdrop>(
    await deploy(hre, "PacksAirdrop", (await ethers.getSigners())[0], [])
  );

  await configureAirdrop(hre, airdrop);
  await endersGate.grantRole(await endersGate.MINTER_ROLE(), airdrop.address);

  writeJsonFile({
    path: `/${fileName}`,
    data: {
      airdrop: airdrop.address,
    },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
