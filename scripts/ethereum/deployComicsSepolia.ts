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
    "0xf3cd27813b5ff6adea3805dcf181053ac62d6ec3",
    "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    18,
  );

  await Comics.grantRole(await Comics.COMIC_ROLE(), _accounts[0].address);
  await Comics.grantRole(await Comics.SUPPLY_ROLE(), _accounts[0].address);
  await Comics.grantRole(await Comics.URI_SETTER_ROLE(), _accounts[0].address);

  await Comics.addToken(
    "0x746c00e6305Ac5C01cb3e84e61b67fb2AD7DCeF3",
    "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
    6,
  );

  await Comics.addToken(
    "0x4C086B2E76e61418a9cBf2Af7Ae9d6d96fD6cD83",
    "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
    6,
  );

  await Comics.addComic(10000, 200);
  await Comics.addComic(10000, 200);

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
