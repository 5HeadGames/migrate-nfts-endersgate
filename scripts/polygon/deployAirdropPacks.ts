import hre, { ethers, network } from "hardhat";

import {
  EndersGate,
  EndersPack,
  LootBoxRandomness__factory,
  PacksAirdrop,
} from "../../types";
import { attach, deploy } from "../../utils/contracts";
import { configureAirdrop, getAirdropConfig } from "../../utils/airdrop";
import { loadJsonFile, writeJsonFile } from "../../utils";

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const user = (await ethers.getSigners())[0];
  const endersGate = <EndersGate>(
    await attach(hre, "EndersGate", fileData.endersGate)
  );
  const packs = (
    await ethers.getContractFactory("EndersPack", {
      libraries: { LootBoxRandomness: fileData.library },
    })
  ).attach(fileData.pack);
  const airdrop = <PacksAirdrop>await deploy(hre, "PacksAirdrop", user, []);
  console.log(airdrop.address);
  const configuration = getAirdropConfig(hre, endersGate, packs);

  await configureAirdrop(hre, configuration, airdrop, endersGate, packs);

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
