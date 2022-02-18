import {ethers, upgrades, network} from "hardhat";
import {BigNumber, BigNumberish} from "@ethersproject/bignumber";
import {expect, assert} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { EndersGate } from "../types";

describe("ERC1155", function () {
  let newNft: EndersGate;

  it("Should deploy properly", async () => {
    const [owner] = await ethers.getSigners();
    console.log(owner.address);
    newNft = (await upgrades.deployProxy(
      await ethers.getContractFactory("EndersGate"),
      {
        kind: "uups",
      }
    )) as EndersGate;
    const adminRole = await newNft.DEFAULT_ADMIN_ROLE();
    const minterRole = await newNft.MINTER_ROLE();
    const uriSetterRole = await newNft.URI_SETTER_ROLE();
    const upgraderRole = await newNft.UPGRADER_ROLE();

    const hasRoleAdmin = await newNft.hasRole(adminRole, owner.address);
    const hasRoleMinter = await newNft.hasRole(minterRole, owner.address);
    const hasRoleURISetter = await newNft.hasRole(uriSetterRole, owner.address);
    const hasRoleUpgrader = await newNft.hasRole(upgraderRole, owner.address);

    expect(hasRoleAdmin, "Is Admin").to.equal(true);
    expect(hasRoleMinter, "Is Minter").to.equal(true);
    expect(hasRoleURISetter, "Is UriSetter").to.equal(true);
    expect(hasRoleUpgrader, "IsUpgrader").to.equal(true);
  });
});


