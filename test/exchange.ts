// import {ethers, upgrades, network} from "hardhat";
// import {expect} from "chai";
// import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

// import {ExchangeERC1155} from "../types/ExchangeERC1155";
// import {EndersGate} from "../types";
// import {ERC1155card} from "../types";

// describe.skip("Exchange", function () {
//   let exchange: ExchangeERC1155,
//     endersGate: EndersGate,
//     oldNft: ERC1155card,
//     oldNft2: ERC1155card,
//     accounts: SignerWithAddress[];
//   const hash = ethers.utils.id(Math.random().toString());
//   const nftHashes = [
//     ethers.utils.id(Math.random().toString()),
//     ethers.utils.id(Math.random().toString()),
//   ];

//   it("Should deploy properly", async () => {
//     accounts = await ethers.getSigners();
//     endersGate = (await (
//       await ethers.getContractFactory("EndersGate")
//     ).deploy("Enders Gate", "GATE", hash, "https://ipfs.io/ipfs/")) as EndersGate;
//     oldNft = await (await ethers.getContractFactory("ERC1155card")).deploy("Dracul");
//     oldNft2 = await (await ethers.getContractFactory("ERC1155card")).deploy("Eross");
//     //exchange = await (
//     //await ethers.getContractFactory("ExchangeERC1155")
//     //).deploy([oldNft.address, oldNft2.address], [1, 1], [1, 2], endersGate.address);

//     const nftToId1 = await exchange.nftToId(oldNft.address, 1);
//     const nftToId2 = await exchange.nftToId(oldNft2.address, 1);

//     await endersGate.grantRole(await endersGate.SUPPLY_ROLE(), exchange.address);
//     await endersGate.setIpfsHashBatch([1, 2], nftHashes);
//     await oldNft.safeTransferFrom(accounts[0].address, accounts[1].address, 1, 50, []);

//     expect(nftToId1).to.equal(1);
//     expect(nftToId2).to.equal(2);
//   });

//   it("Should exchange old nfts for new ones", async () => {
//     const previousBalances = await Promise.all([
//       oldNft.balanceOf(accounts[0].address, 1),
//       oldNft2.balanceOf(accounts[0].address, 1),
//       oldNft.balanceOf(exchange.address, 1),
//       oldNft2.balanceOf(exchange.address, 1),
//     ]);
//     await oldNft.setApprovalForAll(exchange.address, true);
//     await oldNft2.setApprovalForAll(exchange.address, true);

//     await exchange.exchangeAllERC1155([oldNft.address, oldNft2.address], [1, 1]);

//     const newBalances = (
//       await Promise.all([
//         oldNft.balanceOf(accounts[0].address, 1),
//         oldNft2.balanceOf(accounts[0].address, 1),
//         oldNft.balanceOf(exchange.address, 1),
//         oldNft2.balanceOf(exchange.address, 1),
//       ])
//     ).map((bal) => bal.toString());
//     const expected = ["0", "0", previousBalances[0].toString(), previousBalances[1].toString()];

//     expect(newBalances).to.eql(expected);
//   });

//   it("Should update nfts to ids", async () => {
//     const amount = 10;
//     const targetId = 123;
//     const originId = 5;
//     await exchange.updateNftsToId(oldNft.address, originId, targetId);
//     await oldNft.mint(accounts[0].address, originId, amount);
//     await exchange.exchangeAllERC1155([oldNft.address], [originId]);

//     expect(await endersGate.balanceOf(accounts[0].address, targetId)).to.be.equal(amount);
//   });

//   it("Should only allow owner to update nfts to ids", async () => {
//     const amount = 10;
//     const targetId = 123;
//     const originId = 5;
//     await exchange.updateNftsToId(oldNft.address, originId, targetId);
//     await oldNft.mint(accounts[0].address, originId, amount);
//     await expect(
//       exchange.connect(accounts[1]).exchangeAllERC1155([oldNft.address], [originId])
//     ).to.be.revertedWith("");
//   });

//   it("Should not remove nfts uri when minting", async () => {
//     const uris = await Promise.all([endersGate.uri(1), endersGate.uri(2)]);
//     const hashes = uris.map((uri) => uri.split("/").reverse()[0]);
//     expect(hashes).to.satisfy((hash: string[]) => hash.every((cur, i) => cur === hash[i]));
//   });

//   it("Should not mint if you dont have balances", async () => {
//     await expect(
//       exchange.exchangeAllERC1155([oldNft.address, oldNft2.address], [1, 1])
//     ).to.revertedWith("");
//   });

//   it("Should not allow mint from foreign contract", async () => {
//     const foreign = await (await ethers.getContractFactory("ERC1155card")).deploy("Dracul");
//     await expect(exchange.exchangeAllERC1155([foreign.address], [1])).to.be.revertedWith("");
//   });

//   it("Should not allow to transfer nfts out of exchange", async () => {
//     await expect(
//       oldNft.connect(accounts[1]).safeTransferFrom(accounts[1].address, exchange.address, 1, 50, [])
//     ).to.be.revertedWith("");
//   });
// });
