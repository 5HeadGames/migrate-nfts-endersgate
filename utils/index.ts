import Moralis from "moralis/node";
import fs from "fs";
import {TransactionReceipt} from "@ethersproject/providers";

const appRoot = require("app-root-path");

export const uploadIpfs = async ({path}: {path: string}) => {
    const name = path.split("/").reverse()[0];

    await Moralis.start({
        serverUrl: process.env.MORALIS_SERVER_URL,
        appId: process.env.MORALIS_APP_ID,
        masterKey: process.env.MORALIS_MASTER_KEY,
    });

    console.log({path: `${appRoot}${path}`});
    const buff = fs.readFileSync(`${appRoot}${path}`).toString("base64");
    const file = new Moralis.File(name, {base64: buff});

    console.log("UPLOADING...", `${appRoot}${path}`);
    await file.saveIPFS({useMasterKey: true});

    return (file as any).ipfs();
};

export const loadJsonFile = (file: string) => {
    try {
        const data = fs.readFileSync(file);
        return JSON.parse(data as any);
    } catch (err) {
        return {};
    }
};

export const writeJsonFile = (args: {path: string; data: any}) => {
    const appRoot = require("app-root-path");
    const prevData = loadJsonFile(appRoot + args.path);
    const parsedData = JSON.stringify(
        {
            ...prevData,
            ...args.data,
        },
        null,
        2
    );
    console.log('Writting', appRoot + args.path)
    fs.writeFileSync(appRoot + args.path, parsedData);
    console.log(`Generated ${appRoot}${args.path}`);
};

export const getEventLogs = (iface: any, logs: TransactionReceipt['logs'], filter: (log: any) => boolean) => {
    return logs.filter(filter).map(logs => iface.parseLog(logs))
}

