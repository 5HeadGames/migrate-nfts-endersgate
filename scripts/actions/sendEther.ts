import { ethers, network } from "hardhat";
import fs from "fs";
import { EndersBattlePass } from "../types";
import { loadJsonFile } from "../utils";
// import { ClockSaleOwnable } from "../typechain";

async function main() {
  // import ethers.js
  // network: using the Rinkeby testnet
  // provider: Infura or Etherscan will be automatically chosen
  console.log("a");

  // Create a wallet instance
  let wallet = (await ethers.getSigners())[0];
  // Receiver Address which receives Ether
  let receiverAddress = "0x6f0aa45593318870e3475c925a39a79512b2382b";
  // Ether amount to send
  let amountInEther = "10";
  // Create a transaction object
  let tx = {
    to: receiverAddress,
    // Convert currency unit from ether to wei
    value: ethers.utils.parseEther(amountInEther),
  };

  // Send a transaction
  const txResponse = await wallet.sendTransaction(tx);
  console.log(await txResponse.wait());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
