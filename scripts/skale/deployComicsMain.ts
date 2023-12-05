import { ethers, network } from "hardhat";
import fs from "fs";

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
    ethers.getContractFactory("EndersComicsOnlyMultiTokens"),
    ethers.getSigners(),
  ]);

  console.log("deploy:Comics");
  const Comics = await ComicsFactory.deploy("EndersComics", "EGC");

  Comics.grantRole(await Comics.COMIC_ROLE(), _accounts[0].address);
  Comics.grantRole(await Comics.SUPPLY_ROLE(), _accounts[0].address);
  Comics.grantRole(await Comics.URI_SETTER_ROLE(), _accounts[0].address);

  await Comics.addComic(25000000, 200);
  await Comics.addComic(25000000, 200);

  await Comics.addToken(
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7",
    6,
  );

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
