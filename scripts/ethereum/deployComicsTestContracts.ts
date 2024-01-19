import { ethers, network } from "hardhat";
import fs from "fs";
import { wait } from "../../utils";

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

  const [ComicsFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersComicsMultiTokensTest"),
    ethers.getSigners(),
  ]);

  console.log(data, _accounts, network.name);

  console.log("deploy:Comics");
  const Comics = await ComicsFactory
    // .attach(
    //   "0x9829D1853d077ddDA784a8B8d0e855303231cd40",
    // );
    .deploy(
      "EndersComicsTest",
      "EGC",
      "0xf3cd27813b5ff6adea3805dcf181053ac62d6ec3",
      "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
      18,
    );

  console.log("deployed");

  await Comics.grantRole(await Comics.COMIC_ROLE(), _accounts[0].address);
  wait(5000);
  await Comics.grantRole(await Comics.SUPPLY_ROLE(), _accounts[0].address);
  wait(5000);
  await Comics.grantRole(await Comics.URI_SETTER_ROLE(), _accounts[0].address);
  wait(5000);

  await Comics.addToken(
    "0x36c9600994524E46068b0F64407ea509218EfFD8",
    "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    6,
  );
  wait(5000);

  await Comics.addToken(
    "0xBD3045b233bd07a15c8c782ec8702fb5D7Eef163",
    "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    6,
  );
  wait(5000);

  await Comics.addComic(250000, 200);
  wait(5000);
  await Comics.addComic(250000, 200);

  const configData = JSON.stringify(
    {
      ...data,
      comicsTest: Comics.address,
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
