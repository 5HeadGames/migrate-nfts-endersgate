import Moralis from "moralis/node";
import fs from "fs";
import * as dotenv from "dotenv";
import {TransactionReceipt} from "@ethersproject/providers";

dotenv.config();
const appRoot = require("app-root-path");

export const uploadIpfs = async ({path}: {path: string}) => {
    try {
        const name = path
            .split("/")
            .reverse()[0]
            .replace(".", "")
            .replace("'", "")
            .replace(":", "")
            .replace("&", "")
            .replace("_", "")
            .replace("-", "");

        await Moralis.start({
            serverUrl: process.env.MORALIS_SERVER_URL,
            appId: process.env.MORALIS_APP_ID,
            masterKey: process.env.MORALIS_MASTER_KEY,
        });

        const buff = fs.readFileSync(`${appRoot}${path}`).toString("base64");
        const file = new Moralis.File(name, {base64: buff});

        console.log("UPLOADING FILE", `${appRoot}${path}`);
        await file.saveIPFS({useMasterKey: true});
        const hash = (file as any).ipfs() as string;

        console.log("uploaded", hash);
        return hash;
    } catch (err: any) {
        console.log(`ERROR upload ${path}`, err.message);
    }
    return "";
};

export const uploadIpfsObject = async ({element, name}: {element: Object; name: string}) => {
    try {
        const finalName = name
            .replace(".", "")
            .replace("'", "")
            .replace(":", "")
            .replace("&", "")
            .replace("_", "")
            .replace("-", "");

        await Moralis.start({
            serverUrl: process.env.MORALIS_SERVER_URL,
            appId: process.env.MORALIS_APP_ID,
            masterKey: process.env.MORALIS_MASTER_KEY,
        });

        const buff = Buffer.from(JSON.stringify(element)).toString("base64");
        const file = new Moralis.File(finalName, {base64: buff});

        console.log("UPLOADING...", name);
        await file.saveIPFS({useMasterKey: true});

        return (file as any).ipfs() as string;
    } catch (err: any) {
        console.log(`ERROR upload ${name}`, err.message);
    }
    return "";
};

export const loadJsonFile = (file: string) => {
    const appRoot = require("app-root-path");
    try {
        const data = fs.readFileSync(`${appRoot}${file[0] === "/" ? file : "/" + file}`);
        return JSON.parse(data as any);
    } catch (err) {
        return {};
    }
};

export const writeJsonFile = (args: {path: string; data: Object | ((arg: Object) => void)}) => {
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
        2
    );
    console.log("Writting", appRoot + args.path);
    fs.writeFileSync(appRoot + args.path, parsedData);
    console.log(`Generated ${appRoot}${args.path}`);
};

export const getEventLogs = (
    iface: any,
    logs: TransactionReceipt["logs"],
    filter: (log: any) => boolean
) => {
    return logs.filter(filter).map((logs) => iface.parseLog(logs));
};
