import {ethers} from "hardhat";
import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {EndersGate, EndersPack, LootBoxRandomness} from "../../types";
import {getPacksConfig, PacksConfig} from "../../utils/packs";
import {setOptionSettings, setTokensForTypes} from "../../utils/packs/config";

interface PacksFixture {
  packsConfig: PacksConfig;
  library: LootBoxRandomness;
  accounts: SignerWithAddress[];
  endersGate: EndersGate;
  packs: EndersPack;
  hash: string;
  URI: string;
}

export const packsFixture = async (): Promise<PacksFixture> => {
  const packsConfig = getPacksConfig();
  const library = await (await ethers.getContractFactory("LootBoxRandomness")).deploy();
  const hash = ethers.utils.id(Math.random().toString());
  const URI = "https://ipfs.io/ipfs/";

  const accounts = await ethers.getSigners();
  const endersGate = (await (
    await ethers.getContractFactory("EndersGate")
  ).deploy("Enders Gate", "GATE", hash, "https://ipfs.io/ipfs/")) as EndersGate;
  const packs = (await (
    await ethers.getContractFactory("EndersPack", {
      libraries: {
        LootBoxRandomness: library.address,
      },
    })
  ).deploy(URI)) as EndersPack;

  await endersGate.grantRole(await endersGate.SUPPLY_ROLE(), packs.address);
  await endersGate.mintBatch(packs.address, [0, 1, 2], [200, 200, 200], "");
  await packs.setState(endersGate.address, packsConfig.NUM_CARDS, packsConfig.NUM_TYPES, 5);

  return {packsConfig, library, hash, URI, accounts, endersGate, packs};
};

export const packsConfigFixture = async (): Promise<PacksFixture> => {
  const {packsConfig, accounts, packs, endersGate, ...rest} = await packsFixture();

  await setOptionSettings({packsConfig, signer: accounts[0], packs});
  await setTokensForTypes({packsConfig, endersGate, signer: accounts[0], packs});

  await expect(setOptionSettings({packsConfig, signer: accounts[1], packs})).to.be.revertedWith(
    ""
  );
  await expect(
    setTokensForTypes({packsConfig, endersGate, signer: accounts[1], packs})
  ).to.be.revertedWith("");

  return {packsConfig, accounts, packs, endersGate, ...rest};
};
