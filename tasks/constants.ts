export type AddressMap = { [blockchain: string]: string };
export type TokenAmounts = { token: string; amount: string };

export enum PayFeesIn {
  Native,
  LINK,
}

export const supportedNetworks = [
  `sepolia`,
  `optimismGoerli`,
  `arbitrumTestnet`,
  `avalancheFuji`,
  `mumbai`,
];

export const LINK_ADDRESSES: AddressMap = {
  [`sepolia`]: `0x779877A7B0D9E8603169DdbD7836e478b4624789`,
  [`ethereum`]: `0x514910771AF9Ca656af840dff83E8264EcF986CA`,
  [`matic`]: `0xb0897686c545045aFc77CF20eC7A532E3120E0F1`,
  [`mumbai`]: `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`,
  // [`optimismGoerli`]: `0xdc2CC710e42857672E7907CF474a69B63B93089f`,
  // [`arbitrumTestnet`]: `0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28`,
  // [`avalancheFuji`]: `0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846`,
};

export const COMICS_ADDRESSES: AddressMap = {
  [`sepolia`]: `0x233D548A50f178970e54B1DA488aE15643350D00`,
  [`mumbai`]: `0xf484F0983FcB0C0f0456d34624B912b2F22793B6`,
};

export const routerConfig = {
  sepolia: {
    address: `0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59`,
    chainSelector: `16015286601757825753`,
    feeTokens: [
      LINK_ADDRESSES[`sepolia`],
      `0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534`,
    ],
  },
  ethereum: {
    address: `0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D`,
    chainSelector: `5009297550715157269`,
    feeTokens: [
      LINK_ADDRESSES[`ethereum`],
      `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`,
    ],
  },
  matic: {
    address: `0x849c5ED5a80F5B408Dd4969b78c2C8fdf0565Bfe`,
    chainSelector: `4051577828743386545`,
    feeTokens: [
      LINK_ADDRESSES[`matic`],
      `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270`,
    ],
  },
  mumbai: {
    address: `0x1035CabC275068e0F4b745A29CEDf38E13aF41b1`,
    chainSelector: `12532609583862916517`,
    feeTokens: [
      LINK_ADDRESSES[`mumbai`],
      `0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889`,
    ],
  },
  // optimismGoerli: {
  //   address: `0xeb52e9ae4a9fb37172978642d4c141ef53876f26`,
  //   chainSelector: `2664363617261496610`,
  //   feeTokens: [
  //     LINK_ADDRESSES[`optimismGoerli`],
  //     `0x4200000000000000000000000000000000000006`,
  //   ],
  // },
  // avalancheFuji: {
  //   address: `0x554472a2720e5e7d5d3c817529aba05eed5f82d8`,
  //   chainSelector: `14767482510784806043`,
  //   feeTokens: [
  //     LINK_ADDRESSES[`avalancheFuji`],
  //     `0xd00ae08403B9bbb9124bB305C09058E32C39A48c`,
  //   ],
  // },
  // arbitrumTestnet: {
  //   address: `0x88e492127709447a5abefdab8788a15b4567589e`,
  //   chainSelector: `6101244977088475029`,
  //   feeTokens: [
  //     LINK_ADDRESSES[`arbitrumTestnet`],
  //     `0x32d5D5978905d9c6c2D4C417F0E06Fe768a4FB5a`,
  //   ],
  // },
};
