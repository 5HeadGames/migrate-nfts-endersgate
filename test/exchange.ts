import {ethers, upgrades, network} from "hardhat";
import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import {ExchangeERC1155} from "../types/ExchangeERC1155";
import {EndersGate} from "../types/EndersGate";
import {ERC1155card} from "../types/ERC1155card";

describe("Exchange", function () {
  let exchange: ExchangeERC1155,
    newNft: EndersGate,
    oldNft: ERC1155card,
    oldNft2: ERC1155card,
    accounts: SignerWithAddress[];

  it("Should deploy properly", async () => {
    newNft = (await upgrades.deployProxy(
      await ethers.getContractFactory("EndersGate"),
      {
        kind: "uups",
      }
    )) as EndersGate;
    oldNft = await (
      await ethers.getContractFactory("ERC1155card")
    ).deploy("Dracul");
    oldNft2 = await (
      await ethers.getContractFactory("ERC1155card")
    ).deploy("Eross");
    exchange = await (
      await ethers.getContractFactory("ExchangeERC1155")
    ).deploy([oldNft.address, oldNft2.address], [1, 1], [1, 2]);
    const nftToId1 = await exchange.nftToId(oldNft.address, 1);
    const nftToId2 = await exchange.nftToId(oldNft2.address, 1);
    expect(nftToId1).to.equal(1);
    expect(nftToId2).to.equal(2);
  });
});
