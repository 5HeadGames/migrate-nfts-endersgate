import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import "./tasks/attack";
import "./tasks/deploy";

import {resolve} from "path";

import {config as dotenvConfig} from "dotenv";
import {HardhatUserConfig} from "hardhat/config";
import {NetworkUserConfig} from "hardhat/types";

dotenvConfig({path: resolve(__dirname, "./.env")});

const chainIds = {
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};

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
      chainId: chainIds.hardhat,
    },
    //goerli: getChainConfig("goerli"),
    //kovan: getChainConfig("kovan"),
    rinkeby: {
      url: 'https://speedy-nodes-nyc.moralis.io/bdd2a4b14a469f0e3a230d4d/eth/rinkeby',
      accounts: [process.env.PRIVATE_KEY || '']
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
        version: "0.8.11",
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
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
};

export default config;
