import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl, getRouterConfig } from "../utils";
import { Wallet, ethers } from "ethers";

import { Spinner } from "../../utils/spinner";
import { loadJsonFile } from "../../utils";
import { DestinationMinter } from "../../types";
import { LINK_ADDRESSES } from "./constants";

task(
  `usdc-deployment`,
  `Deploys EndersComics.sol and DestinationMinter.sol smart contracts`,
)
  .addOptionalParam(
    `router`,
    `The address of the Router contract on the destination blockchain`,
  )
  .addParam(
    `sourceBlockchain`,
    `The name of the source blockchain (for example sepolia)`,
  )
  .addParam(
    `destinationBlockchain`,
    `The name of the destination blockchain (for example mumbai)`,
  )
  .setAction(
    async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
      const { sourceBlockchain, destinationBlockchain, payFeesIn } =
        taskArguments;
      const idSource = getRouterConfig(sourceBlockchain).chainSelector;
      const idDestination = getRouterConfig(
        destinationBlockchain,
      ).chainSelector;
      const routerAddressSource = taskArguments.router
        ? taskArguments.router
        : getRouterConfig(sourceBlockchain).address;
      const routerAddressDestination = taskArguments.router
        ? taskArguments.router
        : getRouterConfig(destinationBlockchain).address;
      const linkAddressSource = taskArguments.router
        ? taskArguments.link
        : LINK_ADDRESSES[sourceBlockchain];
      const linkAddressDestination = taskArguments.router
        ? taskArguments.link
        : LINK_ADDRESSES[destinationBlockchain];

      const privateKey = getPrivateKey();
      // const rpcSourceProviderUrl = getProviderRpcUrl(sourceBlockchain);
      // console.log(privateKey, rpcSourceProviderUrl);

      // const providerSender = new ethers.providers.JsonRpcProvider(
      //   rpcSourceProviderUrl,
      // );
      const wallet = new Wallet(privateKey);
      // const deployerSender = wallet.connect(providerSender);

      const spinner: Spinner = new Spinner();

      // console.log(
      //   `ℹ️  Attempting to deploy ProgrammableTokenTransfers smart contract on the ${sourceBlockchain} blockchain using ${deployerSender.address} address, with the Router address ${routerAddressSource} provided as constructor argument`,
      // );
      // spinner.start();

      // const senderContract = await (
      //   await hre.ethers.getContractFactory("ProgrammableTokenTransfers")
      // )
      //   .connect(deployerSender)
      //   .deploy(routerAddressSource, linkAddressSource);
      // await senderContract.deployed();

      // spinner.stop();
      // console.log(
      //   `✅ ProgrammableTokenTransfers contract deployed at address ${senderContract.address} on the ${sourceBlockchain} blockchain`,
      // );
      // console.log(
      //   `ℹ️  Attempting to allow destination a source blockchain (${destinationBlockchain}) for ${sourceBlockchain} contract `,
      // );
      // spinner.start();

      // await senderContract.allowlistDestinationChain(idDestination, true);
      // await senderContract.allowlistSourceChain(idDestination, true);

      // spinner.stop();
      // console.log(
      //   `✅ DestinationMinter contract deployed at address ${senderContract.address} on the ${sourceBlockchain} blockchain`,
      // );

      const rpcDestionationProviderUrl = getProviderRpcUrl(
        destinationBlockchain,
      );
      const providerReceiver = new ethers.providers.JsonRpcProvider(
        rpcDestionationProviderUrl,
      );
      const deployerReceiver = wallet.connect(providerReceiver);

      console.log(
        `ℹ️  Attempting to deploy ProgrammableTokenTransfers smart contract on the ${destinationBlockchain} blockchain using ${deployerReceiver.address} address, with the Router address ${routerAddressDestination} provided as constructor argument`,
      );
      spinner.start();

      const receiverContract = await (
        await hre.ethers.getContractFactory("ProgrammableTokenTransfers")
      )
        .connect(deployerReceiver)
        .deploy(routerAddressDestination, linkAddressDestination);
      await receiverContract.deployed();

      spinner.stop();
      console.log(
        `✅ ProgrammableTokenTransfers contract deployed at address ${receiverContract.address} on the ${sourceBlockchain} blockchain`,
      );
      console.log(
        `ℹ️  Attempting to allow destination a source blockchain (${sourceBlockchain}) for ${destinationBlockchain} contract `,
      );
      spinner.start();

      await receiverContract.allowlistDestinationChain(idSource, true);
      await receiverContract.allowlistSender(
        "0x0738A659dce9B7A48E36A1F9D10A54DeAF9F359C",
        true,
      );
      await receiverContract.allowlistSourceChain(idSource, true);

      spinner.stop();
      console.log(
        `✅ ProgrammableTokenTransfers Receiver contract deployed at address ${receiverContract.address} on the ${sourceBlockchain} blockchain`,
      );
    },
  );
