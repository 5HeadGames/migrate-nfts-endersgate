import { ethers, network } from "hardhat";
import fs from "fs";
import { EndersBattlePass, EndersBattlePassFindora } from "../../types";
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
  const configFileName = `addresses.${network.name}.json`;
  const data = loadJsonFile(`${appRoot}/` + configFileName);

  const [BattlePassFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersBattlePassFindora"),
    ethers.getSigners(),
  ]);

  console.log("deploy:BattlePass");
  const battlePass = (await BattlePassFactory.deploy(
    "EndersBattlePass",
    "EBP",
  )) as EndersBattlePassFindora;

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
