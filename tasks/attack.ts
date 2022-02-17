import {Signer} from "@ethersproject/abstract-signer";
import {task} from "hardhat/config";

task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
  const accounts: Signer[] = await hre.ethers.getSigners();

  console.log(accounts)
  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});
