import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";
import Web3 from "web3";
import { EndersPack, EndersRentOnlyMultiTokens__factory } from "../../types";
import { Signer } from "ethers";
import { ClockSaleOwnableOnlyMultiTokens__factory } from "../../types/factories/contracts/OnlyMultitokens/ClockSaleOwnableOnlyMultiTokens__factory";
import { ClockSaleOnlyMultiTokens__factory } from "../../types/factories/contracts/OnlyMultitokens/ClockSaleOnlyMultiTokens__factory";

async function main() {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const [Marketplace, Shop, Rent, _accounts] = (await Promise.all([
    ethers.getContractFactory("ClockSaleOnlyMultiTokens"),
    ethers.getContractFactory("ClockSaleOwnableOnlyMultiTokens"),
    ethers.getContractFactory("EndersRentOnlyMultiTokens"),

    ethers.getSigners(),
  ])) as [
    ClockSaleOnlyMultiTokens__factory,
    ClockSaleOwnableOnlyMultiTokens__factory,
    EndersRentOnlyMultiTokens__factory,
    any,
  ];

  console.log("MARKETPLACE");

  const marketplace = Marketplace.attach(fileData.marketplace);

  await marketplace.addToken(fileData.usdc, 6);

  console.log("RENT");

  const rent = Rent.attach(fileData.rent);

  await rent.addToken(fileData.usdc, 6);

  // console.log("SHOP");

  // const shop = Shop.attach(fileData.rent);

  // await shop.addToken(fileData.usdc, 6);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
