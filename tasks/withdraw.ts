import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl } from "./utils";
import { Wallet, ethers } from "ethers";
import { Spinner } from "../utils/spinner";
import { Withdraw, Withdraw__factory } from "../types";

task(
  `withdraw`,
  `Withdraws tokens and coins from Withdraw.sol. Must be called by an Owner, otherwise it will revert`,
)
  .addParam(`blockchain`, `The name of the blockchain (for example sepolia)`)
  .addParam(
    `from`,
    `The address of the Withdraw.sol smart contract from which funds should be withdrawn`,
  )
  .addOptionalParam(`tokenAddress`, `The address of a token to withdraw`)
  .setAction(async (taskArguments: TaskArguments) => {
    const { blockchain, from, tokenAddress } = taskArguments;

    const privateKey = getPrivateKey();
    const rpcProviderUrl = getProviderRpcUrl(blockchain);

    const provider = new ethers.providers.JsonRpcProvider(rpcProviderUrl);
    const wallet = new Wallet(privateKey);
    const signer = wallet.connect(provider);

    const withdraw: Withdraw = Withdraw__factory.connect(from, signer);

    const spinner: Spinner = new Spinner();

    if (tokenAddress) {
      console.log(
        `ℹ️  Attempting to withdraw ${tokenAddress} tokens from ${from} to ${signer.address}`,
      );
      spinner.start();

      const withdrawalTx = await withdraw.withdrawToken(
        signer.address,
        tokenAddress,
      );
      await withdrawalTx.wait();

      spinner.stop();
      console.log(
        `✅ Withdrawal successful, transaction hash: ${withdrawalTx.hash}`,
      );
    } else {
      console.log(
        `ℹ️  Attempting to withdraw coins from ${from} to ${signer.address}`,
      );
      spinner.start();

      const withdrawalTx = await withdraw.withdraw(signer.address);
      await withdrawalTx.wait();

      spinner.stop();
      console.log(
        `✅ Withdrawal successful, transaction hash: ${withdrawalTx.hash}`,
      );
    }
  });
