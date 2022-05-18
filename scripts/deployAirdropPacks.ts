import hre, {ethers, network} from "hardhat";

import {EndersGate, EndersPack, LootBoxRandomness__factory, PacksAirdrop} from "../types";
import {attach, deploy} from "../utils/contracts";
import {configureAirdrop} from "../utils/airdrop";
import {loadJsonFile, writeJsonFile} from "../utils";

async function main(): Promise<void> {
  const fileName = `addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);

  const user = (await ethers.getSigners())[0];
  const endersGate = <EndersGate>await attach(hre, "EndersGate", fileData.endersGate);
  const packs = (
    await ethers.getContractFactory("EndersPack", {
      libraries: {LootBoxRandomness: fileData.library},
    })
  ).attach(fileData.pack);
  const airdrop = <PacksAirdrop>await deploy(hre, "PacksAirdrop", user, []);
  console.log("airdop", airdrop.address);

  if (!(await airdrop.hasRole(await airdrop.DEFAULT_ADMIN_ROLE(), user.address)))
    throw new Error("USER NOT OWNER: dont transfer ownership");

  await configureAirdrop(hre, airdrop);
  console.log("config");

  await packs.transferOwnership(airdrop.address);
  console.log("ownership");

  await endersGate.grantRole(await endersGate.MINTER_ROLE(), airdrop.address);
  console.log("role");

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
