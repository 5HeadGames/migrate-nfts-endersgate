import {ethers, upgrades, network} from "hardhat";
import {BigNumber, BigNumberish} from "@ethersproject/bignumber";
import {expect, assert} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {EndersGate, EndersPack} from "../types";

const CONFIG = {
  classes: [
    {
      id: 0,
      tokenIds: [CLASSES.wood],
      tokenAmounts: [5],
    },
    {
      id: 1,
      tokenIds: [CLASSES.wood, CLASSES.stone],
      tokenAmounts: [4, 1],
    },
    {
      id: 2,
      tokenIds: [CLASSES.stone, CLASSES.gold],
      tokenAmounts: [4, 1],
    },
    {
      id: 3,
      tokenIds: [CLASSES.stone],
      tokenAmounts: [5],
    },
    {
      id: 4,
      tokenIds: [CLASSES.stone, CLASSES.wood],
      tokenAmounts: [3, 2],
    },
  ],
  options: [
    {
      id: 0,
      maxQuantityPerOpen: 5,
      classProbabilities: [6000, 4000],
      guarantees: [5, 5],
    },
    {
      id: 1,
      maxQuantityPerOpen: 5,
      classProbabilities: [500, 2000, 2500, 2500, 2500],
      guarantees: [5, 5, 5, 5],
    },
  ],
};
const hash = ethers.utils.id(Math.random().toString());
const URI = "https://some/url/",
  NUM_OPTIONS = 10,
  NUM_CLASSES = 5,
  NUM_TYPES = 5;

describe.only("Packs ERC1155", function () {
  let endersGate: EndersGate, accounts: SignerWithAddress[], pack: EndersPack;

  it("Should deploy properly", async () => {
    const library = await (await ethers.getContractFactory('LootBoxRandomness')).deploy()

    accounts = await ethers.getSigners();
    endersGate = (await (
      await ethers.getContractFactory("EndersGate",)
    ).deploy("Enders Gate", "GATE", hash, "https://ipfs.io/ipfs/")) as EndersGate;
    pack = await (
      await ethers.getContractFactory("EndersPack", {
        libraries: {
          LootBoxRandomness: library.address
        },
      })
    ).deploy("Enders Gate Pack", "PACK", URI, "https://ipfs.io/ipfs/");

    await endersGate.grantRole(await endersGate.MINTER_ROLE(), pack.address);
    await endersGate.mintBatch(pack.address, [0, 1, 2], [100, 100, 100], ['', '', ''])
    await pack.setState(endersGate.address, NUM_OPTIONS, NUM_CLASSES, 5);
  });

  it("Should set token ids/class", async () => {
    for await (let i of CONFIG.classes) await pack.setTokenIdsForClass(i.id, i.tokenIds, i.tokenAmounts);
  });

  it("Should set options settings", async () => {
    for await (let i of CONFIG.options)
      await pack.setOptionSettings(
        i.id,
        i.maxQuantityPerOpen,
        i.classProbabilities,
        i.guarantees
      );
  });

  it('Should mint packs normally', async () => {
    const mintId = 0, amount = '100';
    await pack.mint(accounts[0].address, mintId, amount, [])
    expect(await pack.balanceOf(accounts[0].address, mintId)).to.be.equal(amount)
  })

  it('Should unpack and get nfts out of it', async () => {
    const option = 0, amount = 1;
    const accountsBalance = new Array(3).fill(0).map(() => accounts[0].address)
    await pack.unpack(option, accounts[0].address, amount)
    const balances = await endersGate.balanceOfBatch(accountsBalance, [0, 1, 2])
    console.log({balances})
  })
});
