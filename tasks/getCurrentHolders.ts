import {task} from "hardhat/config";
import {writeJsonFile} from "../utils";

const wait = (time: number) => new Promise((resolve, reject) => setTimeout(resolve, time));

task("get-holders", "get holders given timestamp")
  .addParam("timestamp", "timestamp where to check")
  .addParam("contract", "contract to check")
  .addParam("block", "start block to check")
  .addParam("filename", "filename to write the addresses")
  .setAction(async (taskArgs: Record<string, string>, hre) => {
    const {timestamp, contract, block, filename} = taskArgs;
    const {ethers} = hre;
    const accounts = await ethers.getSigners();
    const nft = (await ethers.getContractFactory("ERC1155card")).attach(contract);
    const blockLeap = 900;
    let final: any = [];
    let stop = false,
      i = 0;

    while (!stop) {
      const startBlock = Number(block) + blockLeap * i;
      const endBlock = Number(block) + blockLeap * (i + 1);
      const events = await nft.queryFilter(nft.filters.TransferSingle(), startBlock, endBlock);
      const blockStart = await ethers.provider.getBlock(Number(block) + blockLeap * i);
      if (blockStart) stop = blockStart.timestamp > Number(timestamp);
      final = final.concat(events);
      i++;
      await wait(1500);
      console.log(startBlock, endBlock, "...");
    }

    writeJsonFile({
      path: `/${contract}Whitelist.json`,
      data: final.reduce((acc: Record<string, number>, cur: any) => {
        const receiver = cur.args.to;
        const amount = cur.args.value.toNumber();

        return {
          ...acc,
          [receiver]: acc[receiver] ? acc[receiver] + amount : amount,
        };
      }, {}),
    });
  });
