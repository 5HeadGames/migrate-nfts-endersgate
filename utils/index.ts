import fs from "fs";
import * as dotenv from "dotenv";
import { TransactionReceipt } from "@ethersproject/providers";

import { ContractReceipt } from "@ethersproject/contracts";
import { Interface, LogDescription } from "@ethersproject/abi";

export const getLogs = (iface: Interface, transaction: ContractReceipt) => {
  const response: LogDescription[] = [];
  transaction.logs.forEach((log) => {
    try {
      response.push(iface.parseLog(log));
    } catch (err: any) {}
  });
  return response;
};

dotenv.config();
const appRoot = require("app-root-path");

export const loadJsonFile = (file: string) => {
  const appRoot = require("app-root-path");
  try {
    const data = fs.readFileSync(
      `${appRoot}${file[0] === "/" ? file : "/" + file}`,
    );
    return JSON.parse(data as any);
  } catch (err) {
    return {};
  }
};

export const writeJsonFile = (args: {
  path: string;
  data: Object | ((arg: Object) => void);
}) => {
  const appRoot = require("app-root-path");
  const prevData = loadJsonFile(args.path);
  const parsedData = JSON.stringify(
    typeof args.data === "function"
      ? {
          ...args.data(prevData),
        }
      : {
          ...prevData,
          ...args.data,
        },
    null,
    2,
  );
  fs.writeFileSync(appRoot + args.path, parsedData);
};

export const getEventLogs = (
  iface: any,
  logs: TransactionReceipt["logs"],
  filter: (log: any) => boolean,
) => {
  return logs.filter(filter).map((logs) => iface.parseLog(logs));
};

export const getUrlHash = (ipfsUrl: string) => ipfsUrl.split("/").reverse()[0];

export const wait = (seconds: number) =>
  new Promise((res) => setTimeout(res, seconds));
