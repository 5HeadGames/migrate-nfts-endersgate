// import { ethers, upgrades, network } from "hardhat";
// import { expect, assert } from "chai";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
// import { EndersGate } from "../types";

// describe("ERC1155", function () {
//   let endersGate: EndersGate, accounts: SignerWithAddress[];
//   const hash = ethers.utils.id(Math.random().toString());
//   const URI = "https://some/url/";

//   it("Should deploy properly", async () => {
//     accounts = await ethers.getSigners();
//     const owner = accounts[0];
//     endersGate = (await (
//       await ethers.getContractFactory("EndersGate")
//     ).deploy("Enders Gate", "GATE", hash, "https://ipfs.io/ipfs/", {
//       receiver: owner.address,
//       feeNumerator: 400,
//     })) as EndersGate;
//     const adminRole = await endersGate.DEFAULT_ADMIN_ROLE();
//     const minterRole = await endersGate.SUPPLY_ROLE();
//     const uriSetterRole = await endersGate.URI_SETTER_ROLE();

//     const hasRoleAdmin = await endersGate.hasRole(adminRole, owner.address);
//     const hasRoleMinter = await endersGate.hasRole(minterRole, owner.address);
//     const hasRoleURISetter = await endersGate.hasRole(
//       uriSetterRole,
//       owner.address,
//     );
//     const randomDude = ethers.Wallet.createRandom().address;

//     expect(hasRoleAdmin, "Is Admin").to.equal(true);
//     expect(hasRoleMinter, "Is Minter").to.equal(true);
//     expect(hasRoleURISetter, "Is UriSetter").to.equal(true);

//     expect(
//       await endersGate.hasRole(adminRole, randomDude),
//       "Isnt Admin",
//     ).to.not.equal(true);
//     expect(
//       await endersGate.hasRole(minterRole, randomDude),
//       "Isnt Minter",
//     ).to.not.equal(true);
//     expect(
//       await endersGate.hasRole(uriSetterRole, randomDude),
//       "Isnt Uri setter",
//     ).to.not.equal(true);
//   });

//   it("Should assign roles dynamically", async () => {
//     const minterRole = await endersGate.SUPPLY_ROLE();

//     await endersGate.grantRole(minterRole, accounts[4].address);
//     await expect(
//       endersGate
//         .connect(accounts[1])
//         .grantRole(minterRole, accounts[4].address),
//     ).to.be.revertedWith("");
//     expect(
//       await endersGate.hasRole(minterRole, accounts[4].address),
//       "Role is not given",
//     ).to.be.equal(true);
//   });

//   it("Should remove roles dynamically", async () => {
//     const minterRole = await endersGate.SUPPLY_ROLE();

//     await endersGate.revokeRole(minterRole, accounts[4].address);
//     await expect(
//       endersGate
//         .connect(accounts[1])
//         .revokeRole(minterRole, accounts[4].address),
//     ).to.be.revertedWith("");
//     expect(
//       await endersGate.hasRole(minterRole, accounts[4].address),
//       "Role is not given",
//     ).to.be.equal(false);
//   });

//   it("Should set uri for only setter role", async () => {
//     await expect(endersGate.setURI(URI)).not.to.revertedWith("");
//     await expect(
//       endersGate.connect(accounts[1]).setURI("SOME FALCE URI"),
//     ).to.revertedWith("");
//   });

//   it("Should mint nft with ipfs hash", async () => {
//     const hash = ethers.utils.id(Math.random().toString());
//     const id = 1;
//     await endersGate.mint(accounts[0].address, id, []);
//     // await endersGate.setIpfsHashBatch([id], [hash]);
//     const uri = await endersGate.uri(id);
//     expect(uri).to.be.equal(URI + id);
//   });

//   it("Should increase total supply on normal mint", async () => {
//     const id = 1;
//     const amount = 110;
//     const prevBalance = await endersGate.totalSupply(id);

//     await endersGate.mintBatch(accounts[0].address, [id], [amount], []);
//     const balance = await endersGate.totalSupply(id);

//     expect(balance.toString()).to.be.equal(prevBalance.add(amount).toString());
//   });

//   it("Should increase total supply on batch mint", async () => {
//     const ids = [1, 2, 3, 4, 5, 10];
//     const amounts = [2, 3, 1, 23, 12, 3];
//     const prevBalance = await Promise.all(
//       ids.map((id) => endersGate.totalSupply(id)),
//     );

//     await endersGate.mintBatch(accounts[0].address, ids, amounts, []);
//     const balances = await Promise.all(
//       ids.map((id) => endersGate.totalSupply(id)),
//     );

//     expect(
//       balances.every(
//         (bal, i) =>
//           bal.toString() === prevBalance[i].add(amounts[i]).toString(),
//       ),
//     ).to.be.equal(true);
//   });

//   // it("Should set ipfs only setter role", async () => {
//   //   const ids = [1];
//   //   const hashes = [ethers.utils.id(Math.random().toString())];

//   //   await expect(
//   //     endersGate.connect(accounts[1]).setIpfsHashBatch(ids, hashes),
//   //   ).to.revertedWith("");
//   //   await expect(endersGate.setIpfsHashBatch(ids, hashes)).to.not.revertedWith(
//   //     "",
//   //   );
//   //   expect(await endersGate.uri(ids[0])).to.be.equal(URI + hashes[0]);
//   // });

//   it("Should save last transfer received", async () => {
//     const prevBlockTimestamp = (
//       await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
//     ).timestamp;
//     await endersGate.safeTransferFrom(
//       accounts[0].address,
//       accounts[5].address,
//       5,
//       1,
//       [],
//     );

//     await network.provider.send("evm_increaseTime", [223600]);
//     await network.provider.send("evm_mine");

//     const nextBlockTimestamp = (
//       await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
//     ).timestamp;
//     const lastTransfer = await endersGate.lastTransfer(accounts[5].address);

//     expect(nextBlockTimestamp).to.be.gt(prevBlockTimestamp);
//     expect(lastTransfer.toNumber()).to.be.within(
//       prevBlockTimestamp - 10,
//       prevBlockTimestamp + 10,
//     );
//   });
// });
