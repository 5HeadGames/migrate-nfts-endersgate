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
    "0xf3cd27813b5ff6adea3805dcf181053ac62d6ec3",
    "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
    18,
  )) as EndersBattlePass;

  await battlePass.addToken(
    "0x36c9600994524E46068b0F64407ea509218EfFD8",
    "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    6,
  );

  await battlePass.addToken(
    "0xBD3045b233bd07a15c8c782ec8702fb5D7Eef163",
    "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
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
