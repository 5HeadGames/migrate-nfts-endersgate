import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-web3";
import "hardhat-contract-sizer";
import "./tasks";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenvConfig({ path: resolve(__dirname, "./.env") });

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
      // forking: {
      //   enabled: true,
      //   url: "https://gsc-testnet.prod.findora.org:8545",
      // },
    },
    // goerli: getChainConfig("goerli"),
    // kovan: getChainConfig("kovan"),
    // rinkeby: {
    //   url: "https://speedy-nodes-nyc.moralis.io/bdd2a4b14a469f0e3a230d4d/eth/rinkeby",
    //   accounts: [process.env.PRIVATE_KEY || ""],
    //   gas: 1446592,
    // },
    harmony: {
      url: "https://api.harmony.one/",
      // url: "https://harmony-mainnet.chainstacklabs.com/",
      accounts: [process.env.PRIVATE_KEY || ""],
      timeout: 120000000,
    },
    harmony_test: {
      url: `https://api.s0.b.hmny.io`,
      accounts: [process.env.PRIVATE_KEY || ""],
      timeout: 120000000,
    },
    anvil: {
      url: "https://gsc-testnet.prod.findora.org:8545",
      accounts: [process.env.PRIVATE_KEY || ""],
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      // timeout: 1800000,
      // gas: 2100000,
      // gasPrice: 80000000000,
    },
    findora: {
      url: `https://gsc-mainnet.prod.findora.org:8545`,
      accounts: [process.env.PRIVATE_KEY || ""],
      timeout: 120000000,
    },
    imx_test: {
      url: `https://rpc.testnet.immutable.com/`,
      accounts: [process.env.PRIVATE_KEY || ""],
      timeout: 120000000,
    },
    skale: {
      url: `https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird`,
      accounts: [process.env.PRIVATE_KEY || ""],
      timeout: 120000000,
    },
    linea_test: {
      url: `https://rpc.goerli.linea.build`,
      accounts: [process.env.PRIVATE_KEY || ""],
      timeout: 120000000,
    },
    linea: {
      url: `https://rpc.linea.build`,
      accounts: [process.env.PRIVATE_KEY || ""],
      timeout: 120000000,
      // gas: 5000000,
      // gasPrice: 5000000,
    },
    matic: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/kRM3PkCdafzPawH6DziNlah5olIrcNfl",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    geth: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    geth2: {
      url: "http://127.0.0.2:8546",
      accounts: [process.env.PRIVATE_KEY || ""],
    },

    mumbai: {
      url: process.env.MUMBAI_PROVIDER,
      accounts: [process.env.PRIVATE_KEY || ""],
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
      gas: 2100000,
      gasPrice: 80000000000,
    },

    sepolia: {
      url: process.env.SEPOLIA_PROVIDER,
      accounts: [process.env.PRIVATE_KEY || ""],
    },

    ethereum: {
      url: process.env.ETHEREUM_PROVIDER,
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
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
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
      sepolia: process.env.ETHEREUM_API_KEY,
      mainnet: process.env.ETHEREUM_API_KEY,
    },
  } as any,
};

export default config;
