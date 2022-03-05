import {ethers, upgrades, network} from "hardhat";
import {BigNumber, BigNumberish} from "@ethersproject/bignumber";
import {expect, assert} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {EndersGate} from "../types";

describe("ERC1155", function () {
  let endersGate: EndersGate, accounts: SignerWithAddress[];
  const hash = ethers.utils.id(Math.random().toString());
  const URI = "https://some/url/";

  it("Should deploy properly", async () => {
    accounts = await ethers.getSigners();
    const owner = accounts[0];
    endersGate = (await (
      await ethers.getContractFactory("EndersGate")
    ).deploy("Enders Gate", "GATE", hash, "https://ipfs.io/ipfs/")) as EndersGate;
    const adminRole = await endersGate.DEFAULT_ADMIN_ROLE();
    const minterRole = await endersGate.MINTER_ROLE();
    const uriSetterRole = await endersGate.URI_SETTER_ROLE();

    const hasRoleAdmin = await endersGate.hasRole(adminRole, owner.address);
    const hasRoleMinter = await endersGate.hasRole(minterRole, owner.address);
    const hasRoleURISetter = await endersGate.hasRole(uriSetterRole, owner.address);
    const randomDude = ethers.Wallet.createRandom().address;

    expect(hasRoleAdmin, "Is Admin").to.equal(true);
    expect(hasRoleMinter, "Is Minter").to.equal(true);
    expect(hasRoleURISetter, "Is UriSetter").to.equal(true);

    expect(await endersGate.hasRole(adminRole, randomDude), "Isnt Admin").to.not.equal(true);
    expect(await endersGate.hasRole(minterRole, randomDude), "Isnt Minter").to.not.equal(true);
    expect(
      await endersGate.hasRole(uriSetterRole, randomDude),
      "Isnt Uri setter"
    ).to.not.equal(true);
  });

  it("Should set uri for only setter role", async () => {
    await expect(endersGate.setURI(URI)).not.to.revertedWith("");
    await expect(endersGate.connect(accounts[1]).setURI("SOME FALCE URI")).to.revertedWith("");
  });

  it("Should mint nft with ipfs hash", async () => {
    const hash = ethers.utils.id(Math.random().toString());
    const id = 1;
    await endersGate.mint(accounts[0].address, id, 1, hash);
    const uri = await endersGate.uri(id);
    expect(uri).to.be.equal(URI + hash);
  });

  it("Should increase total supply on normal mint", async () => {
    const hash = ethers.utils.id(Math.random().toString());
    const id = 1;
    const amount = 110;
    const prevBalance = await endersGate.totalSupply(id);

    await endersGate.mint(accounts[0].address, id, amount, hash);
    const balance = await endersGate.totalSupply(id);

    expect(balance.toString()).to.be.equal(prevBalance.add(amount).toString());
  });

  it("Should increase total supply on batch mint", async () => {
    const hash = ethers.utils.id(Math.random().toString());
    const ids = [1, 2, 3, 4, 5, 10];
    const amounts = [2, 3, 1, 23, 12, 3];
    const prevBalance = await endersGate.totalSupplyBatch(ids);

    await endersGate.mintBatch(
      accounts[0].address,
      ids,
      amounts,
      amounts.map(() => hash)
    );
    const balances = await endersGate.totalSupplyBatch(ids);

    expect(
      balances.every((bal, i) => bal.toString() === prevBalance[i].add(amounts[i]).toString())
    ).to.be.equal(true);
  });

  it("Should set ipfs only setter role", async () => {
    const ids = [1];
    const hashes = [ethers.utils.id(Math.random().toString())];

    await expect(
      endersGate.connect(accounts[1]).setIpfsHashBatch(ids, hashes)
    ).to.revertedWith("");
    await expect(endersGate.setIpfsHashBatch(ids, hashes)).to.not.revertedWith("");
    expect(await endersGate.uri(ids[0])).to.be.equal(URI + hashes[0]);
  });
});
