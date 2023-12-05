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
  console.log(data);

  const [ComicsFactory, _accounts] = await Promise.all([
    ethers.getContractFactory("EndersComicsNative"),
    ethers.getSigners(),
  ]);

  console.log("deploy:Comics");
  const Comics = await ComicsFactory.deploy("EndersComics", "EGC");

  await wait(10000);

  await Comics.grantRole(await Comics.COMIC_ROLE(), _accounts[0].address);
  await wait(10000);

  await Comics.grantRole(await Comics.SUPPLY_ROLE(), _accounts[0].address);
  await wait(10000);

  await Comics.grantRole(await Comics.URI_SETTER_ROLE(), _accounts[0].address);
  await wait(10000);

  await Comics.addComic(10000000, 100);
  await wait(10000);
  await Comics.addComic(10000000, 100);

  const configData = JSON.stringify(
    {
      ...data,
      comics: Comics.address,
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
