import {ethers, upgrades, network} from "hardhat";
import {BigNumber, BigNumberish} from "@ethersproject/bignumber";
import {expect, assert} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {EndersGate} from "../types";

describe("ERC1155", function () {
  let newNft: EndersGate,
    accounts: SignerWithAddress[];
  const URI = 'https://some/url/'

  it("Should deploy properly", async () => {
    accounts = await ethers.getSigners();
    const owner = accounts[0]
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
    const randomDude = ethers.Wallet.createRandom().address

    expect(hasRoleAdmin, "Is Admin").to.equal(true);
    expect(hasRoleMinter, "Is Minter").to.equal(true);
    expect(hasRoleURISetter, "Is UriSetter").to.equal(true);
    expect(hasRoleUpgrader, "IsUpgrader").to.equal(true);

    expect(await newNft.hasRole(adminRole, randomDude), "Isnt Admin").to.not.equal(true);
    expect(await newNft.hasRole(minterRole, randomDude), "Isnt Minter").to.not.equal(true);
    expect(await newNft.hasRole(uriSetterRole, randomDude), "Isnt Uri setter").to.not.equal(true);
    expect(await newNft.hasRole(upgraderRole, randomDude), "Isnt Upgrader").to.not.equal(true);
  });

  it('Should set uri for only setter role', async () => {
    await expect(newNft.setURI(URI)).not.to.revertedWith('')
    await expect(newNft.connect(accounts[1]).setURI('SOME FALCE URI')).to.revertedWith('')
  })

  it('Should mint nft with ipfs hash', async () => {
    const hash = ethers.utils.id(Math.random().toString())
    const id = 1
    await newNft.mint(accounts[0].address, id, 1, hash);
    const uri = await newNft.uri(id)
    expect(uri).to.be.equal(URI + hash);
  })

  it('Should set ipfs only setter role', async () => {
    const ids = [1]
    const hashes = [ethers.utils.id(Math.random().toString())]

    await expect(newNft.connect(accounts[1]).setIpfsHashBatch(ids, hashes)).to.revertedWith('')
    await expect(newNft.setIpfsHashBatch(ids, hashes)).to.not.revertedWith('')
    expect(await newNft.uri(ids[0])).to.be.equal(URI + hashes[0])
  })
});


