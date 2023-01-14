import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
//import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "hardhat-contract-sizer";
import path from "path";

import "./tasks";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};

// console.log(process.env.PRIVATE_KEY);

// Ensure that we have all the environment variables we need.

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  //gasReporter: {
  //currency: "USD",
  //enabled: process.env.REPORT_GAS ? true : false,
  //excludeContracts: [],
  //src: "./contracts",
  //},
  networks: {
    hardhat: {
      accounts: {
        count: 200, //must be set higher when testing packs
      },
    },
    // goerli: getChainConfig("goerli"),
    // kovan: getChainConfig("kovan"),
    // rinkeby: {
    //   url: "https://speedy-nodes-nyc.moralis.io/bdd2a4b14a469f0e3a230d4d/eth/rinkeby",
    //   accounts: [process.env.PRIVATE_KEY || ""],
    //   gas: 1446592,
    // },
    // harmony: {
    //   url: "https://harmony-0-rpc.gateway.pokt.network",
    //   accounts: [process.env.PRIVATE_KEY || ""],
    //   timeout: 120000000,
    // },
    // harmony_test: {
    //   url: `https://api.s0.b.hmny.io`,
    //   accounts: [process.env.PRIVATE_KEY || ""],
    //   timeout: 120000000,
    // },
    matic: {
      url: process.env.POLYGON_PROVIDER,
      accounts: [process.env.PRIVATE_KEY || ""],
    },

    mumbai: {
      url: process.env.MUMBAI_PROVIDER,
      accounts: [process.env.PRIVATE_KEY || ""],
    },

    //ropsten: getChainConfig("ropsten"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.13",
      },
      {
        version: "0.8.10",
      },
      {
        version: "0.8.0",
      },
    ],
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 10,
      },
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: false,
  },
  mocha: {
    timeout: 600000,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
    },
  },
};

export default config;
