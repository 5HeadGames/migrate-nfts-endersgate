import { PayFeesIn, routerConfig } from "./ccip/constants";

export const getProviderRpcUrl = (network: string) => {
  let rpcUrl;

  switch (network) {
    case "sepolia":
      rpcUrl = process.env.SEPOLIA_PROVIDER;
      break;
    case "optimismGoerli":
      rpcUrl = process.env.OPTIMISM_GOERLI_RPC_URL;
      break;
    case "matic":
      rpcUrl = process.env.POLYGON_PROVIDER;
      break;
    case "ethereum":
      rpcUrl = process.env.ETHEREUM_PROVIDER;
      break;
    case "mumbai":
      rpcUrl = process.env.MUMBAI_PROVIDER;
      break;
    default:
      throw new Error("Unknown network: " + network);
  }

  if (!rpcUrl)
    throw new Error(
      `rpcUrl empty for network ${network} - check your environment variables`,
    );

  return rpcUrl;
};

export const getPrivateKey = () => {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey)
    throw new Error(
      "private key not provided - check your environment variables",
    );

  return privateKey;
};

export const getRouterConfig = (network: string) => {
  switch (network) {
    case "sepolia":
      return routerConfig.sepolia;
    case "ethereum":
      return routerConfig.ethereum;
    case "matic":
      return routerConfig.matic;
    case "mumbai":
      return routerConfig.mumbai;
    default:
      throw new Error("Unknown network: " + network);
  }
};

export const getPayFeesIn = (payFeesIn: string) => {
  let fees;

  switch (payFeesIn) {
    case "Native":
      fees = PayFeesIn.Native;
      break;
    case "native":
      fees = PayFeesIn.Native;
      break;
    case "LINK":
      fees = PayFeesIn.LINK;
      break;
    case "link":
      fees = PayFeesIn.LINK;
      break;
    default:
      fees = PayFeesIn.Native;
      break;
  }

  return fees;
};
