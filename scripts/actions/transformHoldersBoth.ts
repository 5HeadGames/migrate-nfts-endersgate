import { ethers, network } from "hardhat";
import fs from "fs";

const parseSaleTokens = (sale: any[]) => {
  return {
    seller: sale[0],
    nft: sale[1],
    nftId: sale[2],
    amount: sale[3],
    price: sale[4],
    tokens: sale[5],
    duration: sale[6],
    startedAt: sale[7],
    status: sale[8],
  };
};

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
  const draculFile = `nfts_holders/dracul.json`;
  const erossFile = `nfts_holders/eross.json`;
  const draculData = loadJsonFile(`${appRoot}/` + draculFile);
  const erossData = loadJsonFile(`${appRoot}/` + erossFile);

  const jsonFullData: any = {};

  draculData.result.forEach(({ owner_of, amount }: any) => {
    jsonFullData[owner_of] = parseInt(amount);
  });

  erossData.result.forEach(({ owner_of, amount }: any) => {
    if (jsonFullData[owner_of]) jsonFullData[owner_of] += parseInt(amount);
    else jsonFullData[owner_of] = parseInt(amount);
  });

  const newFullDataWallets = {
    result: Object.keys(jsonFullData).map((wallet: any) => {
      return wallet;
    }),
  };

  const newFullDataQuantity = {
    result: Object.keys(jsonFullData).map((wallet: any) => {
      return jsonFullData[wallet];
    }),
  };

  const configFullDataWallet = JSON.stringify(newFullDataWallets, null, 2);
  fs.writeFileSync(
    "nfts_holders/both_filtered_array_wallets.json",
    configFullDataWallet,
  );

  const configFullDataQuantity = JSON.stringify(newFullDataQuantity, null, 2);
  fs.writeFileSync(
    "nfts_holders/both_filtered_array_amount.json",
    configFullDataQuantity,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
