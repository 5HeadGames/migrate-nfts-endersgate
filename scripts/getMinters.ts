import {ethers} from "hardhat";
import {writeJsonFile} from "../utils";

const oldAddresses = {
  dracul: {
    address: "0x51BE175Fa7A56B98BCFFA124D6Bd31480b093214",
    blockNumber: 20134054,
    dateLimit: new Date("12-08-2021").getTime() / 1000,
  },
  eross: {
    address: "0xE1C04284652be3771D514e5f05F823b35075D70F",
    blockNumber: 21013637,
    dateLimit: new Date("12-30-2021").getTime() / 1000,
  },
  presale: "0x08536482fDE0caDdef1C1f558E1D02b1c7b9e3f7",
};

const blockLeap = 900;
const wait = (time: number) => new Promise((resolve, reject) => setTimeout(resolve, time));

async function getWhitelist(contract: "dracul" | "eross"): Promise<void> {
  const accounts = await ethers.getSigners();
  const config = oldAddresses[contract];
  const nft = (await ethers.getContractFactory("ERC1155card")).attach(config.address);
  let final: any = [];
  let stop = false,
    i = 0;

  while (!stop) {
    const startBlock = config.blockNumber + blockLeap * i;
    const endBlock = config.blockNumber + blockLeap * (i + 1);
    const events = await nft.queryFilter(nft.filters.TransferSingle(), startBlock, endBlock);
    const blockStart = await ethers.provider.getBlock(config.blockNumber + blockLeap * i);
    if (blockStart) stop = blockStart.timestamp > config.dateLimit;
    final = final.concat(events);
    i++;
    await wait(1500);
    console.log(startBlock, endBlock, "...");
  }

  final = final.filter((ev: any) => ev.args.from === oldAddresses.presale);
  console.log(
    contract.toUpperCase(),
    final.reduce((acc: Record<string, number>, cur: any) => {
      const receiver = cur.args.to;
      const amount = cur.args.value.toNumber();

      return {
        ...acc,
        [receiver]: acc[receiver] ? acc[receiver] + amount : amount,
      };
    }, {})
  );
  //writeJsonFile({
  //path: `/${contract}Whitelist.json`,
  //data: final.reduce((acc: Record<string, number>, cur: any) => {
  //const receiver = cur.args.to;
  //const amount = cur.args.value.toNumber();

  //return {
  //...acc,
  //[receiver]: acc[receiver] ? acc[receiver] + amount : amount,
  //};
  //}, {}),
  //});
}

const main = async () => {
  console.log("dracul");
  await getWhitelist("dracul");
  console.log("eross");
  await getWhitelist("eross");
};

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
