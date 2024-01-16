import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl, getRouterConfig } from "./utils";
import { Wallet, ethers } from "ethers";

import { Spinner } from "../utils/spinner";
import { loadJsonFile } from "../utils";
import { DestinationMinter } from "../types";

task(
  `deploy-destination-minter`,
  `Deploys EndersComics.sol and DestinationMinter.sol smart contracts`,
)
  .addOptionalParam(
    `router`,
    `The address of the Router contract on the destination blockchain`,
  )
  .setAction(
    async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
      const routerAddress = taskArguments.router
        ? taskArguments.router
        : getRouterConfig(hre.network.name).address;

      const privateKey = getPrivateKey();
      const rpcProviderUrl = getProviderRpcUrl(hre.network.name);

      const provider = new ethers.providers.JsonRpcProvider(rpcProviderUrl);
      const wallet = new Wallet(privateKey);
      const deployer = wallet.connect(provider);

      const spinner: Spinner = new Spinner();

      const appRoot = require("app-root-path");
      const configFileName = `addresses/addresses.${hre.network.name}.json`;
      const data = loadJsonFile(`${appRoot}/` + configFileName);
      console.log(data);

      console.log(
        `ℹ️  Attempting to deploy EndersComics smart contract on the ${hre.network.name} blockchain using ${deployer.address} address`,
      );
      spinner.start();

      const EndersComics = (
        await hre.ethers.getContractFactory("EndersComicsMultiTokens")
      ).attach(data.comics);

      spinner.stop();
      console.log(
        `ℹ️  Attempting to deploy DestinationMinter smart contract on the ${hre.network.name} blockchain using ${deployer.address} address, with the Router address ${routerAddress} provided as constructor argument`,
      );
      spinner.start();

      const destinationMinter = await (
        await hre.ethers.getContractFactory("DestinationMinter")
      ).deploy(routerAddress, EndersComics.address);
      await destinationMinter.deployed();

      spinner.stop();
      console.log(
        `✅ DestinationMinter contract deployed at address ${destinationMinter.address} on the ${hre.network.name} blockchain`,
      );

      console.log(
        `ℹ️  Attempting to grant the minter role to the DestinationMinter smart contract`,
      );
      spinner.start();

      const tx = await EndersComics.grantRole(
        await EndersComics.SUPPLY_ROLE(),
        destinationMinter.address,
      );
      await tx.wait();

      spinner.stop();
      console.log(
        `✅ DestinationMinter can now mint EndersComicss. Transaction hash: ${tx.hash}`,
      );
    },
  );
