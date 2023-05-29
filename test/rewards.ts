import { ethers, upgrades, network } from "hardhat";
import { expect, assert } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { EndersBattlePass, MockERC20 } from "../types";
import { Console } from "console";

describe("REWARDS", function () {
  let endersBattlePass: EndersBattlePass,
    accounts: SignerWithAddress[],
    token: MockERC20,
    token2: MockERC20,
    token3: MockERC20;
  const hash = ethers.utils.id(Math.random().toString());
  const URI = "https://some/url/";

  it("Should deploy properly", async () => {
    accounts = await ethers.getSigners();
    const owner = accounts[0];
    token = (await (
      await ethers.getContractFactory("MockERC20")
    ).deploy()) as MockERC20;
    token2 = (await (
      await ethers.getContractFactory("MockERC20")
    ).deploy()) as MockERC20;
    token3 = (await (
      await ethers.getContractFactory("MockERC20")
    ).deploy()) as MockERC20;

    endersBattlePass = (await (
      await ethers.getContractFactory("EndersBattlePass")
    ).deploy(
      "EndersBattlePass",
      "EGR",
      token.address,
      token.address,
      6,
    )) as EndersBattlePass;

    await token.mint(owner.address, 100000000000);
    // await token2.mint(owner.address, 100000000000);
    await token3.mint(owner.address, 100000000000);

    endersBattlePass.addToken(token2.address, token2.address, 6);

    const adminRole = await endersBattlePass.DEFAULT_ADMIN_ROLE();
    const minterRole = await endersBattlePass.SUPPLY_ROLE();
    const uriSetterRole = await endersBattlePass.URI_SETTER_ROLE();
    const seasonRole = await endersBattlePass.SEASON_ROLE();

    const hasRoleAdmin = await endersBattlePass.hasRole(
      adminRole,
      owner.address,
    );
    const hasRoleMinter = await endersBattlePass.hasRole(
      minterRole,
      owner.address,
    );
    const hasRoleURISetter = await endersBattlePass.hasRole(
      uriSetterRole,
      owner.address,
    );
    const hasRoleSeason = await endersBattlePass.hasRole(
      seasonRole,
      owner.address,
    );
    const randomDude = ethers.Wallet.createRandom().address;

    expect(hasRoleAdmin, "Is Admin").to.equal(true);
    expect(hasRoleMinter, "Is Minter").to.equal(true);
    expect(hasRoleURISetter, "Is UriSetter").to.equal(true);
    expect(hasRoleSeason, "Is SeasonSetter").to.equal(true);

    expect(
      await endersBattlePass.hasRole(adminRole, randomDude),
      "Isnt Admin",
    ).to.not.equal(true);
    expect(
      await endersBattlePass.hasRole(minterRole, randomDude),
      "Isnt Minter",
    ).to.not.equal(true);
    expect(
      await endersBattlePass.hasRole(uriSetterRole, randomDude),
      "Isnt Uri setter",
    ).to.not.equal(true);

    expect(
      await endersBattlePass.hasRole(seasonRole, randomDude),
      "Isnt Season Setter",
    ).to.not.equal(true);
  });

  it("Should assign roles dynamically", async () => {
    const minterRole = await endersBattlePass.SUPPLY_ROLE();

    await endersBattlePass.grantRole(minterRole, accounts[4].address);
    await expect(
      endersBattlePass
        .connect(accounts[1])
        .grantRole(minterRole, accounts[4].address),
    ).to.be.revertedWith("");
    expect(
      await endersBattlePass.hasRole(minterRole, accounts[4].address),
      "Role is not given",
    ).to.be.equal(true);
  });

  it("Should remove roles dynamically", async () => {
    const minterRole = await endersBattlePass.SUPPLY_ROLE();

    await endersBattlePass.revokeRole(minterRole, accounts[4].address);
    await expect(
      endersBattlePass
        .connect(accounts[1])
        .revokeRole(minterRole, accounts[4].address),
    ).to.be.revertedWith("");
    expect(
      await endersBattlePass.hasRole(minterRole, accounts[4].address),
      "Role is not given",
    ).to.be.equal(false);
  });

  it("Should set uri for only setter role", async () => {
    await expect(
      endersBattlePass.setIpfsHashBatch([1], [URI]),
    ).not.to.revertedWith("");
    await expect(
      endersBattlePass
        .connect(accounts[1])
        .setIpfsHashBatch([1], ["SOME FALSE URI"]),
    ).to.revertedWith("");
  });

  it("Should mint nft with ipfs hash", async () => {
    const hash = ethers.utils.id(Math.random().toString());
    const id = 0;
    await endersBattlePass.mint(accounts[0].address, id, []);
    await endersBattlePass.setIpfsHashBatch([id], [URI + hash]);
    const uri = await endersBattlePass.uri(id);
    expect(uri).to.be.equal(URI + hash);
  });

  it("Should create season rewards", async () => {
    await endersBattlePass.addSeason(
      (await endersBattlePass.currentSeason()).toNumber() + 1,
      100000000,
    );
    expect(
      await (
        await endersBattlePass.seasons(await endersBattlePass.currentSeason())
      ).exists,
    ).to.be.equal(true);
  });

  it("Should create several seasons and end the previous one", async () => {
    for (let i = 0; i < 10; i++) {
      await endersBattlePass.addSeason(i, 100000000);
      expect(
        await (
          await endersBattlePass.seasons(await endersBattlePass.currentSeason())
        ).exists,
      ).to.be.equal(true);
      if (i > 0) {
        expect(
          await (
            await endersBattlePass.seasons(
              (await endersBattlePass.currentSeason()).toNumber() - 1,
            )
          ).ended,
        ).to.be.equal(true);
      }
    }
  });

  it("Should buy only the nfts of the current season", async () => {
    // await token.increaseAllowance(endersBattlePass.address, 100000000000);
    for (let i = 1; i <= 10; i++) {
      console.log(i);

      await endersBattlePass.addSeason(i, 100000000);
      expect(
        await (
          await endersBattlePass.seasons(await endersBattlePass.currentSeason())
        ).exists,
      ).to.be.equal(true);

      console.log(i);

      await endersBattlePass.buyRewards(token.address, 1, {
        value: await endersBattlePass.getPrice(token.address, 1),
      });

      console.log(i);

      const balanceContract = await ethers.provider.getBalance(
        endersBattlePass.address,
      );

      console.log(i);

      expect(balanceContract).to.be.equal(
        (await endersBattlePass.getPrice(token.address, 1)).mul(i),
      );

      console.log(i);

      expect(
        await endersBattlePass.balanceOf(
          accounts[0].address,
          await (
            await endersBattlePass.seasons(
              await endersBattlePass.currentSeason(),
            )
          ).rewardId,
        ),
      ).to.be.equal(1);
    }
  });

  it("Should mint only the supply role", async () => {
    const id = 1;
    const amount = 110;

    await expect(
      endersBattlePass
        .connect(accounts[1])
        .mintBatch(accounts[1].address, [id], [amount], []),
    ).to.be.reverted;
  });

  it("Should increase total supply on normal mint", async () => {
    const id = 1;
    const amount = 110;
    const prevBalance = await endersBattlePass.totalSupply(id);

    await endersBattlePass.mintBatch(accounts[0].address, [id], [amount], []);
    const balance = await endersBattlePass.totalSupply(id);

    expect(balance.toString()).to.be.equal(prevBalance.add(amount).toString());
  });

  it("Should increase total supply on batch mint", async () => {
    const ids = [1, 2, 3, 4, 5, 10];
    const amounts = [2, 3, 1, 23, 12, 3];
    const prevBalance = await Promise.all(
      ids.map((id) => endersBattlePass.totalSupply(id)),
    );

    await endersBattlePass.mintBatch(accounts[0].address, ids, amounts, []);
    const balances = await Promise.all(
      ids.map((id) => endersBattlePass.totalSupply(id)),
    );

    expect(
      balances.every(
        (bal, i) =>
          bal.toString() === prevBalance[i].add(amounts[i]).toString(),
      ),
    ).to.be.equal(true);
  });

  it("Should set ipfs only setter role", async () => {
    const ids = [1];
    const hashes = [ethers.utils.id(Math.random().toString())];

    await expect(
      endersBattlePass.connect(accounts[1]).setIpfsHashBatch(ids, hashes),
    ).to.revertedWith("");
    await expect(
      endersBattlePass.setIpfsHashBatch(ids, hashes),
    ).to.not.revertedWith("");
    expect(await endersBattlePass.uri(ids[0])).to.be.equal(hashes[0]);
  });
});
