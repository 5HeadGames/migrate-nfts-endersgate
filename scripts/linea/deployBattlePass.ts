import { ethers, network } from "hardhat";
import fs from "fs";
import { EndersBattlePass } from "../../types";
// import { ClockSaleOwnable } from "../typechain";

const loadJsonFile = (file: string) => {
  try {
    const data = fs.readFileSync(file);
    return JSON.parse(data as any);
  } catch (err) {
    return {};
  }
};

async function main() {
  const appRoot = require("app-root-path");
  const configFileName = `addresses/addresses.${network.name}.json`;
  const data = loadJsonFile(`${appRoot}/` + configFileName);
  console.log(data);

  const [BattlePassFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersBattlePass"),
    ethers.getSigners(),
  ]);

  console.log("deploy:BattlePass");
  const battlePass = (await BattlePassFactory.deploy(
    "EndersBattlePass",
    "EBP",
    "0x2C1b868d6596a18e32E61B901E4060C872647b6C",
    "0xcCFF6C2e770Faf4Ff90A7760E00007fd32Ff9A97",
    18,
  )) as EndersBattlePass;

  await battlePass.addToken(
    data.usdc,
    "0xd8d927e5d52Bb7cdb2C0ae6f55ACcB18e9a2B9D7",
    6,
  );

  const configData = JSON.stringify(
    {
      ...data,
      battlePass: battlePass.address,
    },
    null,
    2,
  );
  fs.writeFileSync(configFileName, configData);
  console.log("SUCCESS", configData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
