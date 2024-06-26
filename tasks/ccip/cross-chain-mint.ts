import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import {
  getPayFeesIn,
  getPrivateKey,
  getProviderRpcUrl,
  getRouterConfig,
} from "../utils";
import { Wallet, ethers } from "ethers";
import { Spinner } from "../../utils/spinner";
import { getCcipMessageId } from "./helpers";
import { SourceMinter, SourceMinter__factory } from "../../types";
import { loadJsonFile } from "../../utils";
import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";

task(`cross-chain-mint`, `Mints the new NFT by sending the Cross-Chain Message`)
  .addParam(
    `sourceBlockchain`,
    `The name of the source blockchain (for example sepolia)`,
  )
  .addParam(
    `destinationBlockchain`,
    `The name of the destination blockchain (for example mumbai)`,
  )
  .addParam(`payFeesIn`, `Choose between 'Native' and 'LINK'`)
  .setAction(
    async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
      const { sourceBlockchain, destinationBlockchain, payFeesIn } =
        taskArguments;

      const [signer] = await hre.ethers.getSigners();
      const sourceRpcProviderUrl = getProviderRpcUrl(sourceBlockchain);

      const sourceProvider = new ethers.providers.JsonRpcProvider(
        sourceRpcProviderUrl,
      );

      const spinner: Spinner = new Spinner();

      const destinationChainSelector = getRouterConfig(
        destinationBlockchain,
      ).chainSelector;
      const fees = getPayFeesIn(payFeesIn);

      const sourceFileName = `addresses/addresses.${sourceBlockchain}.json`;
      const dataSource = loadJsonFile(sourceFileName);

      const destFileName = `addresses/addresses.${destinationBlockchain}.json`;
      const dataDestination = loadJsonFile(destFileName);

      const sourceMinterContract: SourceMinter = SourceMinter__factory.connect(
        dataSource.sourceMinter,
        signer,
      );

      // const EndersComicsFactory = await hre.ethers.getContractFactory(
      //   "EndersComicsMultiTokens",
      // );

      // const EndersComics = await EndersComicsFactory.attach(dataSource.comics);

      // console.log(
      //   `ℹ️  Setting approval for All for ${signer.address} to comics`,
      // );
      // spinner.start();

      // const txApproval = await EndersComics.setApprovalForAll(
      //   dataSource.sourceMinter,
      //   true,
      // );
      // await txApproval.wait();

      // spinner.stop();

      // console.log(
      //   `✅ Mint Approval sent, transaction hash: ${txApproval.hash}`,
      // );

      spinner.start();
      console.log(
        `ℹ️  Attempting to call the mint function of the SourceMinter.sol smart contract on the ${sourceBlockchain} from ${signer.address} account`,
      );

      spinner.stop();
      spinner.start();

      const tx = await sourceMinterContract.mint(
        destinationChainSelector,
        dataDestination.destinationMinter,
        "0x40f75fb842e9001390bb11E89D02991E838095A7",
        [1, 2],
        [2, 4],
        fees,
      );

      const receipt = await tx.wait();

      spinner.stop();
      console.log(`✅ Mint request sent, transaction hash: ${tx.hash}`);

      if (receipt != null) {
        await getCcipMessageId(tx, receipt, sourceProvider);
      } else {
        console.log(`❌ Receipt is null`);
      }

      console.log(`✅ Task cross-chain-mint finished with the execution`);
    },
  );
