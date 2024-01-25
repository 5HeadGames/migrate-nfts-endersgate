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
    ethers.getContractFactory("EndersComicsMultiTokens"),
    ethers.getSigners(),
  ]);

  console.log("deploy:Comics");
  const Comics = await ComicsFactory.deploy(
    "EndersComics",
    "EGC",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    18,
  );

  Comics.grantRole(await Comics.COMIC_ROLE(), _accounts[0].address);
  Comics.grantRole(await Comics.SUPPLY_ROLE(), _accounts[0].address);
  Comics.grantRole(await Comics.URI_SETTER_ROLE(), _accounts[0].address);

  await Comics.addToken(
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
    6,
  );

  // await Comics.addComic(25000000, 200);
  // await Comics.addComic(25000000, 200);

  const configData = JSON.stringify(
    {
      ...data,
      Comics: Comics.address,
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
