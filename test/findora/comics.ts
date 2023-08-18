import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { EndersComicsFindora } from "../../types";

describe("COMICS", function () {
  let endersComic: EndersComicsFindora,
    accounts: SignerWithAddress[],
    owner: SignerWithAddress;
  const URI = "https://some/url/";

  it("Should deploy properly", async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0];

    endersComic = await (
      await ethers.getContractFactory("EndersComicsFindora")
    ).deploy("EndersComics", "EGC");

    const adminRole = await endersComic.DEFAULT_ADMIN_ROLE();
    const minterRole = await endersComic.SUPPLY_ROLE();
    const uriSetterRole = await endersComic.URI_SETTER_ROLE();
    const seasonRole = await endersComic.COMIC_ROLE();

    const hasRoleAdmin = await endersComic.hasRole(adminRole, owner.address);
    const hasRoleMinter = await endersComic.hasRole(minterRole, owner.address);
    const hasRoleURISetter = await endersComic.hasRole(
      uriSetterRole,
      owner.address,
    );
    const hasRoleSeason = await endersComic.hasRole(seasonRole, owner.address);
    const randomDude = ethers.Wallet.createRandom().address;

    expect(hasRoleAdmin, "Is Admin").to.equal(true);
    expect(hasRoleMinter, "Is Minter").to.equal(true);
    expect(hasRoleURISetter, "Is UriSetter").to.equal(true);
    expect(hasRoleSeason, "Is comicsetter").to.equal(true);

    expect(
      await endersComic.hasRole(adminRole, randomDude),
      "Isnt Admin",
    ).to.not.equal(true);
    expect(
      await endersComic.hasRole(minterRole, randomDude),
      "Isnt Minter",
    ).to.not.equal(true);
    expect(
      await endersComic.hasRole(uriSetterRole, randomDude),
      "Isnt Uri setter",
    ).to.not.equal(true);

    expect(
      await endersComic.hasRole(seasonRole, randomDude),
      "Isnt Season Setter",
    ).to.not.equal(true);
  });

  it("Should assign roles dynamically", async () => {
    const minterRole = await endersComic.SUPPLY_ROLE();

    await endersComic.grantRole(minterRole, accounts[4].address);
    await expect(
      endersComic
        .connect(accounts[1])
        .grantRole(minterRole, accounts[4].address),
    ).to.be.revertedWith("");
    expect(
      await endersComic.hasRole(minterRole, accounts[4].address),
      "Role is not given",
    ).to.be.equal(true);
  });

  it("Should remove roles dynamically", async () => {
    const minterRole = await endersComic.SUPPLY_ROLE();

    await endersComic.revokeRole(minterRole, accounts[4].address);
    await expect(
      endersComic
        .connect(accounts[1])
        .revokeRole(minterRole, accounts[4].address),
    ).to.be.revertedWith("");
    expect(
      await endersComic.hasRole(minterRole, accounts[4].address),
      "Role is not given",
    ).to.be.equal(false);
  });

  it("Should set uri for only setter role", async () => {
    await expect(endersComic.setIpfsHashBatch([1], [URI])).not.to.revertedWith(
      "",
    );
    await expect(
      endersComic
        .connect(accounts[1])
        .setIpfsHashBatch([1], ["SOME FALSE URI"]),
    ).to.revertedWith("");
  });

  it("Should buy batch", async () => {
    for (let i = 1; i <= 10; i++) {
      await endersComic.addComic(100000000);

      expect(
        await (
          await endersComic.comics(await endersComic.comicIdCounter())
        ).exists,
      ).to.be.equal(true);

      await endersComic.buyBatch(
        owner.address,
        (new Array((await endersComic.comicIdCounter()).toNumber()) as any)
          .fill(1)
          .map((a: any, i: any) => i + 1),
        (new Array((await endersComic.comicIdCounter()).toNumber()) as any)
          .fill(1)
          .map((a: any, i: any) => 10),
        {
          from: owner.address,
          value: await endersComic.getPrice(
            await endersComic.comicIdCounter(),
            10,
          ),
        },
      );

      const balanceContract = await ethers.provider.getBalance(
        endersComic.address,
      );

      expect(balanceContract).to.be.equal(
        (
          await endersComic.getPrice(await endersComic.comicIdCounter(), 10)
        ).mul(i),
      );

      expect(
        await endersComic.balanceOf(
          owner.address,
          (
            await endersComic.comics(await endersComic.comicIdCounter())
          ).id,
        ),
      ).to.be.equal(10);
    }
  });

  it("Should mint nft with ipfs hash", async () => {
    const hash = ethers.utils.id(Math.random().toString());
    const id = 0;
    await endersComic.mint(accounts[0].address, id, []);
    await endersComic.setIpfsHashBatch([id], [URI + hash]);
    const uri = await endersComic.uri(id);
    expect(uri).to.be.equal(URI + hash);
  });

  it("Should mint only the supply role", async () => {
    const id = 1;
    const amount = 110;

    await expect(
      endersComic
        .connect(accounts[1])
        .mintBatch(accounts[1].address, [id], [amount], []),
    ).to.be.reverted;
  });

  it("Should increase total supply and the on normal mint", async () => {
    const id = 1;
    const amount = 110;
    const prevBalance = await endersComic.totalSupply(id);

    await endersComic.mintBatch(accounts[0].address, [id], [amount], []);
    const balance = await endersComic.totalSupply(id);

    expect(balance.toString()).to.be.equal(prevBalance.add(amount).toString());
  });

  it("Should create season rewards", async () => {
    await endersComic.addComic(100000000);
    expect(
      await (
        await endersComic.comics(await endersComic.comicIdCounter())
      ).exists,
    ).to.be.equal(true);
  });

  it("Should increase total supply on batch mint", async () => {
    const ids = [1, 2, 3, 4, 5, 10];
    const amounts = [2, 3, 1, 23, 12, 3];
    const prevBalance = await Promise.all(
      ids.map((id) => endersComic.totalSupply(id)),
    );

    await endersComic.mintBatch(accounts[0].address, ids, amounts, []);
    const balances = await Promise.all(
      ids.map((id) => endersComic.totalSupply(id)),
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
      endersComic.connect(accounts[1]).setIpfsHashBatch(ids, hashes),
    ).to.revertedWith("");
    await expect(endersComic.setIpfsHashBatch(ids, hashes)).to.not.revertedWith(
      "",
    );
    expect(await endersComic.uri(ids[0])).to.be.equal(hashes[0]);
  });
});
