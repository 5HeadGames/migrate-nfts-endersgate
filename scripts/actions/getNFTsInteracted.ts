import { ethers, network } from "hardhat";
import { loadJsonFile } from "../../utils";
import fs from "fs";

async function main(): Promise<void> {
  const fileName = `addresses/addresses.${network.name}.json`;
  const fileData = loadJsonFile(fileName);
  const data = [
    "0xc4127164bf9a4c3caa724438ce5d7e9a01088457",
    "0x5baa9ca23f3e267dc469e91e5a39cd40e7c02e8b",
    "0x3caec1b35c38fde81b58f4beef61472daf3b8f68",
    "0x092e4cf1c4de7c2c78e58edd964f1dd9daecf3c6",
    "0xe2c66e42d932ddd8097ed5b6960fd6d18fe5aa04",
    "0xd122b6ccaea041ced703b8ecefd132a68c16f999",
    "0xfacb00003ab6b565ada18bcf8bf2428f04a0f444",
    "0x08937a855a1cb00029e29464fed8f06bdeaf13da",
    "0xcd638150afe4839afc933f448e0055337c959d43",
    "0xecb0f9230669207a59be009f0e0a86f5898ac8db",
    "0x9b02508affb8d53bd87bbd8b165e98af8d8e5b59",
    "0x78fb79d58cbf6f0462e346cf24ed5f3a1b8c6d23",
    "0xbdba5f0e233be83a507b6626d955e2b171c8f920",
    "0x9ee60c1f24fdc2947b4b37da3039526f5f59f0f0",
    "0xa919f9ad0e6d6ca5789b85743c923bab449ba82c",
    "0x3196947bbedd926c3c0dfcf2a4c0781ee71cec6e",
    "0xd2d7d7d20d9482f9fdac9619cbbbf0b21da51b70",
    "0x77412737180e186361bf860660ab858ca7677c54",
    "0xdcb8c6435ab5999ecc0f6fec75d10055e18feca0",
    "0x7a5cacf9b006b53de81fd264b280030239285502",
    "0xab6faf49854e665ea8e3e36f83eb6da669654634",
    "0x3df9df6eb462e7d276f0bbdf468f47a72e240d8b",
    "0xf6ec016e1e52ea0314834ad726fd3342edbf55cd",
    "0x4900d62465100ec25e7480ca31da2f3f634ba58d",
    "0x936ecd13d2acc9c45bec00111964dda2b6ee9ac7",
    "0xb4e7419a42ea01c418998fcc1df2ac0788e97566",
    "0xc1e4155e505910f9c1018f677a49c4a3a6787519",
    "0x9cc62019a2f314e76da198e7dcfe681a5ea66cce",
    "0x9b7917f95bbe817b84547e26c5e55450935b5ae2",
    "0x85ca40b9a4f2b26755c41a4770c79b0996ca94ae",
    "0x5b2af2593cf8b6467886ace88d53b3dec5384c56",
    "0x87da0336a5fd528f6c06ec02c6523122bc6133db",
    "0x2d1f8e9bfb75a6350fb0fe20402b183269fb9387",
    "0xc254a04fed809deac24fec6bf74871996c4df86b",
    "0x5c57c52856d6d9cc8678ad3b6b52267221ec5e4f",
    "0x489b552990876e3151f1ac08c1c6ecbc34b15289",
    "0x2d5a17539943a8c1a753578af3b4f91c9eb85eb9",
    "0x1f59468ffc6a9cd7a4aea0ad15bf52afef189054",
    "0x455977eb0ba930fab2962d67c1864f2a64da13e8",
    "0x085f42f20b35c6c24e4c64e105b10490c75f6b56",
    "0x78691aadc7a8fc51cdf4bc87ae6870e89282f05d",
    "0xf67495bfcb293410cf41269aae2f89ed49fff605",
    "0xe3ce985db7dc931f12ef19f51b12e1d05faa6bd1",
    "0x20c696b204adc48714eaedbe95a905c54a75efaa",
    "0xb13f760bef3cdd7af3fdbc6455243b0512e673bb",
    "0xa652bdf3992539b1edf4f33edb743c84c2dfd7b4",
    "0xd15f96a72dfbe6e82cd1ef331c3fc75dac65b25c",
    "0x9945550180b908881158f92280524e22241b6c7f",
    "0x9cb02e703868e26f73c01d535b810afc2a98cc70",
    "0x3071fc556fcb0200d2e0274f197ad0449f2a7d0b",
    "0x1e295f213bfe9a19ce0545801b4a2334d189bc9b",
    "0x0106d24d66e7b7973f495213d35d60a1e53d8cb9",
    "0x1fa2aa04da074c39d912a74451b75b6db8ab89b5",
    "0xb8ebad79772b14768c5520fe090ba2aa7aa42839",
    "0xe84c41a97da5deafd5b987ff60b5934862647175",
    "0x651b4fdba6239d7481099cd32a803b263a5c150a",
    "0x8bceec6df9f82d61c43e837df2a73cfe98b33744",
    "0xd07f060caabb79cb8fe048cf5306b22de3f9938c",
    "0xa61301a5199671ab6c5d2e21c718fddbdab778e3",
    "0xcdd9bf3ebaf4c90587722915c17c0a010536c55c",
    "0x825a57697e0f3d2c4f19b4cd8b7d28cc5955f56a",
    "0x2eafd5f044a5d7811b45e48cc59c8953403595fb",
    "0x7a0373a8789562dd3923d3c212e249e5e88723cf",
    "0x7e3d993a8d63c25d1db5f7ff8a8d6c59091003b1",
    "0x2b4ea7e64fae040f7b491e62c88ffbb0306ccb5f",
    "0x2c24c8accde4a4b9ea393ddae1ba11813a3a6865",
    "0x2c562bf4f6058905cce5c0abff30fd3fcfc3e01f",
    "0x38032f326436fdb9c7a9b359e90010f86b8ab482",
    "0x7740cc89a83dd38998f2ac2d91eb892006860b58",
    "0xae9794d1b2563736ac1a00e5721224e0b1c8c4b8",
    "0xcc803585886d30522ff60d97af93ebfe848ae715",
    "0x4618d3c1d51c4e5afa73b50924614ff5fce89467",
    "0x7471f9440ab5fe580a06b483c0f850586da7f9a8",
    "0xc9d745d40766c3275b85f1c42c9556b2dc6497d7",
    "0x6458abb800c1835db625d00f0a3a7b6c3727216a",
    "0x6c9c692fbfef68dbb1efc51738e16afbc2fee5b9",
    "0x274fdd8a24fcb08185af98662c0a8ba6fc9dfde6",
    "0x6f3c0a91dbbdaaeb721678daf3d89fc071d790d8",
  ];
  const newData: any = [];
  const newBalanceAllData: any = [];
  const newBalanceDracul: any = [];
  const newBalanceEross: any = [];
  const newAddressesEross: any = [];
  const newAddressesDracul: any = [];

  for (let i = 0; i < data.length; i++) {
    const addressToCheck = data[i];

    // if (network.name === "harmony") {
    const dracul = (await ethers.getContractFactory("ERC1155card")).attach(
      fileData.dracul,
    );
    const eross = (await ethers.getContractFactory("ERC1155card")).attach(
      fileData.eross,
    );
    const draculBalance = await dracul.balanceOf(addressToCheck, 1);
    const erossBalance = await eross.balanceOf(addressToCheck, 1);
    console.log("DRACUL:", draculBalance);
    console.log("EROSS:", erossBalance);
    // }

    const marketplace = (await ethers.getContractFactory("ClockSale")).attach(
      fileData.marketplace,
    );

    const sales = new Array(1000).fill(1 as any).map((a, i) => i);

    const salesUser = (await marketplace.getSales(sales))
      .map(({ seller, nftId, amount, status }) => {
        return { seller, nftId, amount, status };
      })
      .filter(({ seller, status }) => {
        return (
          seller.toLowerCase() == addressToCheck.toLowerCase() && status == 0
        );
      })
      .filter(
        ({ nftId }) => nftId.toNumber() === 215 || nftId.toNumber() === 230,
      );

    console.log("SALES", salesUser);

    const endersGate = (await ethers.getContractFactory("EndersGate")).attach(
      fileData.endersGate,
    );

    const addresstoGetCards = new Array(2).fill(addressToCheck);
    const idsCards = new Array(234).fill(1).map((a, id) => id);
    const balance = (
      await endersGate.balanceOfBatch(addresstoGetCards, [215, 230])
    )
      .map((balance, id) => {
        return { balance: Number(balance), id: [215, 230][id] };
      })
      .filter(({ balance }) => {
        return balance > 0;
      });
    console.log("CARDS", balance);

    if (
      balance.length > 0 ||
      erossBalance.toNumber() > 0 ||
      draculBalance.toNumber() > 0 ||
      salesUser.length > 0
    ) {
      let draculSalesBalance = 0;
      let erossSalesBalance = 0;
      const draculSales = salesUser
        .filter(({ nftId }) => {
          return nftId.toNumber() === 215;
        })
        .map(({ amount }) => {
          draculSalesBalance += amount.toNumber();
          return amount.toNumber();
        });
      const erossSales = salesUser
        .filter(({ nftId }) => {
          return nftId.toNumber() === 230;
        })
        .map(({ amount }) => {
          erossSalesBalance += amount.toNumber();
          return amount.toNumber();
        });
      console.log(erossSales, draculSales);
      newData.push(addressToCheck);
      newBalanceAllData.push(
        (balance.find((balance) => balance.id === 215)?.balance || 0) +
          draculBalance.toNumber() +
          draculSalesBalance +
          (balance.find((balance) => balance.id === 230)?.balance || 0) +
          erossBalance.toNumber() +
          erossSalesBalance,
      );
      if (
        (balance.find((balance) => balance.id === 215)?.balance || 0) +
          draculBalance.toNumber() +
          draculSalesBalance >
        0
      ) {
        newBalanceDracul.push(
          (balance.find((balance) => balance.id === 215)?.balance || 0) +
            draculBalance.toNumber() +
            draculSalesBalance,
        );
        newAddressesDracul.push(addressToCheck);
      }
      if (
        (balance.find((balance) => balance.id === 230)?.balance || 0) +
          erossBalance.toNumber() +
          erossSalesBalance >
        0
      ) {
        newBalanceEross.push(
          (balance.find((balance) => balance.id === 230)?.balance || 0) +
            erossBalance.toNumber() +
            erossSalesBalance,
        );
        newAddressesEross.push(addressToCheck);
      }
    }
  }

  const configDraculData = JSON.stringify({ result: newData }, null, 2);
  fs.writeFileSync("nfts_holders/holdersInHarmony.json", configDraculData);
  const configBalanceData = JSON.stringify(
    { result: newBalanceAllData },
    null,
    2,
  );
  fs.writeFileSync("nfts_holders/balancesInHarmony.json", configBalanceData);
  const configBalanceDraculData = JSON.stringify(
    { result: newBalanceDracul },
    null,
    2,
  );
  fs.writeFileSync(
    "nfts_holders/holdersDraculInHarmony.json",
    configBalanceDraculData,
  );
  const configBalanceErossData = JSON.stringify(
    { result: newBalanceEross },
    null,
    2,
  );
  fs.writeFileSync(
    "nfts_holders/holdersErossInHarmony.json",
    configBalanceErossData,
  );
  const configErossAddressData = JSON.stringify(
    { result: newAddressesEross },
    null,
    2,
  );
  fs.writeFileSync(
    "nfts_holders/addressErossInHarmony.json",
    configErossAddressData,
  );
  const configDraculAddressData = JSON.stringify(
    { result: newAddressesDracul },
    null,
    2,
  );
  fs.writeFileSync(
    "nfts_holders/addressDraculInHarmony.json",
    configDraculAddressData,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
