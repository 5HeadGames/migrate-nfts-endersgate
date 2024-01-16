import { ethers, network } from "hardhat";
import fs from "fs";

const loadJsonFile = (file: string) => {
  try {
    const data = fs.readFileSync(file);
    return JSON.parse(data as any);
  } catch (err) {
    return {};
  }
};

async function main() {
  const appRoot = require("app-root-path");
  const draculFile = `nfts_holders/dracul.json`;
  const erossFile = `nfts_holders/eross.json`;
  const draculData = loadJsonFile(`${appRoot}/` + draculFile);
  const erossData = loadJsonFile(`${appRoot}/` + erossFile);

  const draculSales: any = [
    {
      id: 0,
      saleId: 0,
      blockchain: "matic",
      owner_of: "0x500c64c3F29907336Bd75Fe8599d9D17e95907dD",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "215",
      amount: "2",
      price: "1551000000",
      tokens: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
      ],
      duration: "71019560",
      startedAt: "1675376469",
      status: "2",
    },
    {
      id: 2,
      saleId: 2,
      blockchain: "matic",
      owner_of: "0xE9Df3DE6526091825a99939Fa8376CE648299aCb",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "215",
      amount: "1",
      price: "2000000000",
      tokens: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
      duration: "73359427",
      startedAt: "1675477425",
      status: "0",
    },
    {
      id: 12,
      saleId: 12,
      blockchain: "matic",
      owner_of: "0x5C78ee7c3053dDd370e11Ac53844d3E339868Fb7",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "215",
      amount: "2",
      price: "1500000000",
      tokens: [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
      ],
      duration: "2125066",
      startedAt: "1675518234",
      status: "2",
    },

    {
      id: 33,
      saleId: 32,
      blockchain: "matic",
      owner_of: "0x26Ae7659C43c4E5d01999429976D063Ee9E94478",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "215",
      amount: "1",
      price: "650000000",
      tokens: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
      duration: "221889179",
      startedAt: "1702239084",
      status: "0",
    },
    {
      id: 38,
      saleId: 33,
      blockchain: "matic",
      owner_of: "0x1a3933c1BB0BcE13A7b65788C366B19D9348807B",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "215",
      amount: "1",
      price: "699000000",
      tokens: [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
      ],
      duration: "195653",
      startedAt: "1704764404",
      status: "0",
    },
    {
      id: 39,
      saleId: 34,
      blockchain: "matic",
      owner_of: "0x6618af3Fe00C0eC3DE8cf3e62d65ef4e01D11759",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "215",
      amount: "2",
      price: "499000000",
      tokens: [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
      ],
      duration: "181737",
      startedAt: "1704778358",
      status: "2",
    },
  ];

  const erossSales: any = [
    {
      id: 1,
      saleId: 1,
      blockchain: "matic",
      owner_of: "0xE9Df3DE6526091825a99939Fa8376CE648299aCb",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "230",
      amount: "1",
      price: "500000000",
      tokens: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
      duration: "73402769",
      startedAt: "1675434162",
      status: "0",
    },
    {
      id: 14,
      saleId: 14,
      blockchain: "matic",
      owner_of: "0x5C78ee7c3053dDd370e11Ac53844d3E339868Fb7",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "230",
      amount: "1",
      price: "500000000",
      tokens: [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
      ],
      duration: "2036667",
      startedAt: "1675520118",
      status: "2",
    },
    {
      id: 15,
      saleId: 15,
      blockchain: "matic",
      owner_of: "0x500c64c3F29907336Bd75Fe8599d9D17e95907dD",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "230",
      amount: "1",
      price: "499000000",
      tokens: [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
      ],
      duration: "60593131",
      startedAt: "1675524886",
      status: "0",
    },
    {
      id: 27,
      saleId: 27,
      blockchain: "matic",
      owner_of: "0x53e015C2Ac7e638b9aC5115f8CCBA8d20BbF4368",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "230",
      amount: "1",
      price: "399000000",
      tokens: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
      duration: "13955576",
      startedAt: "1689996444",
      status: "0",
    },
    {
      id: 28,
      saleId: 28,
      blockchain: "matic",
      owner_of: "0x6C87CBE6F5b85a463a52D0251aEeA2209300416B",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "230",
      amount: "1",
      price: "468000000",
      tokens: [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      ],
      duration: "45577701",
      startedAt: "1689996718",
      status: "0",
    },
    {
      id: 30,
      saleId: 30,
      blockchain: "matic",
      owner_of: "0x3c1fEAA02e6dcF76aCAd161bF1297f2D0763dA0F",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "230",
      amount: "1",
      price: "100000000",
      tokens: [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
      ],
      duration: "14455830",
      startedAt: "1697355061",
      status: "0",
    },
    {
      id: 32,
      saleId: 31,
      blockchain: "matic",
      owner_of: "0xC445da50851D84522a95a6574544698bC0951754",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "230",
      amount: "1",
      price: "95000000",
      tokens: [
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      ],
      duration: "5077271",
      startedAt: "1701852089",
      status: "0",
    },
    {
      id: 41,
      saleId: 36,
      blockchain: "matic",
      owner_of: "0x6618af3Fe00C0eC3DE8cf3e62d65ef4e01D11759",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "230",
      amount: "1",
      price: "99000000",
      tokens: [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
      ],
      duration: "94279",
      startedAt: "1704865967",
      status: "0",
    },
    {
      id: 42,
      saleId: 37,
      blockchain: "matic",
      owner_of: "0xcA50c71f0D9D00E7d075B3c72EE7A272e32Baaf7",
      nft: "0xaA52cb8fd4a9Aa000AaF3a660bb61BacEd085B2E",
      nftId: "230",
      amount: "2",
      price: "94000000",
      tokens: [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
      ],
      duration: "14646684",
      startedAt: "1705051780",
      status: "0",
    },
  ];

  const newDraculData = {
    ...draculData,
    size: draculData.result.length,
    result: draculData.result.map(({ owner_of, amount }: any) => {
      return owner_of;
    }),
  };

  const newErossData = {
    ...erossData,
    size: erossData.result.length,
    result: erossData.result.map(({ owner_of, amount }: any) => {
      return owner_of;
    }),
  };

  console.log(newDraculData.result.length, newErossData.result.length, "data");

  const configDraculData = JSON.stringify(newDraculData, null, 2);
  fs.writeFileSync("nfts_holders/dracul_filtered_array.json", configDraculData);
  const configErossData = JSON.stringify(newErossData, null, 2);
  fs.writeFileSync("nfts_holders/eross_filtered_array.json", configErossData);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
