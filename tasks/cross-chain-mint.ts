import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import {
  getPayFeesIn,
  getPrivateKey,
  getProviderRpcUrl,
  getRouterConfig,
} from "./utils";
import { Wallet, ethers } from "ethers";
import { Spinner } from "../utils/spinner";
import { getCcipMessageId } from "./helpers";
import { SourceMinter, SourceMinter__factory } from "../types";

task(`cross-chain-mint`, `Mints the new NFT by sending the Cross-Chain Message`)
  .addParam(
    `sourceBlockchain`,
    `The name of the source blockchain (for example sepolia)`,
  )
  .addParam(
    `sourceMinter`,
    `The address of the SourceMinter.sol smart contract on the source blockchain`,
  )
  .addParam(
    `destinationBlockchain`,
    `The name of the destination blockchain (for example mumbai)`,
  )
  .addParam(
    `destinationMinter`,
    `The address of the DestinationMinter.sol smart contract on the destination blockchain`,
  )
  .addParam(`payFeesIn`, `Choose between 'Native' and 'LINK'`)
  .setAction(async (taskArguments: TaskArguments) => {
    const {
      sourceBlockchain,
      sourceMinter,
      destinationBlockchain,
      destinationMinter,
      payFeesIn,
    } = taskArguments;

    const privateKey = getPrivateKey();
    const sourceRpcProviderUrl = getProviderRpcUrl(sourceBlockchain);

    const sourceProvider = new ethers.providers.JsonRpcProvider(
      sourceRpcProviderUrl,
    );
    const wallet = new Wallet(privateKey);
    const signer = wallet.connect(sourceProvider);

    const spinner: Spinner = new Spinner();

    const sourceMinterContract: SourceMinter = SourceMinter__factory.connect(
      sourceMinter,
      signer,
    );

    const destinationChainSelector = getRouterConfig(
      destinationBlockchain,
    ).chainSelector;
    const fees = getPayFeesIn(payFeesIn);

    console.log(
      `ℹ️  Attempting to call the mint function of the SourceMinter.sol smart contract on the ${sourceBlockchain} from ${signer.address} account`,
    );
    spinner.start();

    const tx = await sourceMinterContract.mint(
      destinationChainSelector,
      destinationMinter,
      [1, 2, 3, 4],
      [5, 6, 7, 8],
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
  });
