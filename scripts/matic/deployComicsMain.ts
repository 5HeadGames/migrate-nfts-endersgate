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
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
    18,
  );

  Comics.grantRole(await Comics.COMIC_ROLE(), _accounts[0].address);
  Comics.grantRole(await Comics.SUPPLY_ROLE(), _accounts[0].address);
  Comics.grantRole(await Comics.URI_SETTER_ROLE(), _accounts[0].address);

  await Comics.addToken(
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7",
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
