import { ethers, network, upgrades } from "hardhat";

import { EndersGate, EndersPack } from "../../types";
import { loadJsonFile, writeJsonFile, wait } from "../../utils";
import { getPacksConfig, PacksConfig } from "../../utils/packs";

const setPacksState = async ({
  pack,
  packsConfig,
  endersGate,
}: {
  pack: EndersPack;
  packsConfig: PacksConfig;
  endersGate: EndersGate;
}) => {
  // const tx = await endersGate.grantRole(
  //   await endersGate.SUPPLY_ROLE(),
  //   pack.address,
  // );
  // console.log("MINTER ROLE", tx.hash);

  // const tx2 = await pack.setState(
  //   endersGate.address,
  //   packsConfig.NUM_CARDS,
  //   packsConfig.NUM_TYPES,
  //   5,
  // );
  // console.log("CONFIG", tx2.hash);

  console.log({ configLength: packsConfig.cards.length });
  // for await (let i of packsConfig.cards) {
  //   console.log({ length: i.types.length });
  //   await wait(10000);
  //   await pack.setOptionSettings(
  //     i.id,
  //     i.mintLimit,
  //     i.types.map(({ id }) => id),
  //     i.types.map(({ inferiorLimit }) => inferiorLimit),
  //     i.types.map(({ superiorLimit }) => superiorLimit),
  //   );
  // }
  console.log("CARDS");

  for await (let i of packsConfig.types) {
    await wait(10000);
    await pack.setTokensForTypes(i.id, i.nftsIds);
    console.log(i.id, i.nftsIds);
  }
  console.log("TYPES");
};

async function main(): Promise<void> {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const packsConfig = getPacksConfig();

  const endersGate: EndersGate = (
    await ethers.getContractFactory("EndersGate")
  ).attach(fileData.endersGate);

  console.log("Enders Gate", endersGate.address, fileData.library);

  const library = await (
    await ethers.getContractFactory("LootBoxRandomness")
  ).attach(fileData.library);

  console.log("LIBRARY", library.address);

  const pack = await (
    await ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: library.address,
      },
    })
  ).attach(fileData.pack);

  console.log("setPacksState");
  await setPacksState({ pack, packsConfig, endersGate });

  writeJsonFile({
    path: `/${fileName}`,
    data: { pack: pack.address, library: library.address },
  });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
