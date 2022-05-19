import {HardhatRuntimeEnvironment} from "hardhat/types";
import {BigNumberish} from "ethers";

import {loadJsonFile} from "..";
import {PacksAirdrop, EndersGate, EndersPack} from "../../types";

let findDuplicates = (arr: unknown[]) => arr.filter((item, index) => arr.indexOf(item) != index);

const minters = loadJsonFile("minters.json") as Record<
    "dracul" | "eross",
    {balance: number; account: string}[]
>;
const holders = loadJsonFile("holders.json") as Record<
    "dracul" | "eross",
    {balance: number; account: string}[]
>;

export type Reward = {
    token: string;
    tokenId: number;
    amount: number;
};

export const getAirdropConfig = (
    hre: HardhatRuntimeEnvironment,
    endersGate: EndersGate,
    packs: EndersPack
) => {
    const baseConfig: Record<string, Reward[]> = {};
    const contractBalance: Record<string, Record<string, number>> = {};

    const addBalance = (token: string, tokenId: number, balance: number) => {
        if (!contractBalance[token]) contractBalance[token] = {};

        if (isNaN(Number(contractBalance[token][tokenId])))
            contractBalance[token][tokenId] = balance;
        else contractBalance[token][tokenId] += balance;
    };

    const parseConfig = (
        elements: {account: string; balance: number}[],
        token: string,
        tokenId: number
    ) => {
        elements.forEach(({account, balance}) => {
            const reward = {token, tokenId, amount: balance};
            if (baseConfig[account]) baseConfig[account].push(reward);
            else baseConfig[account] = [reward];
            addBalance(token, tokenId, balance);
        });
    };

    parseConfig(minters.dracul, packs.address, 3);
    parseConfig(minters.eross, packs.address, 2);
    parseConfig(holders.dracul, endersGate.address, 231);
    parseConfig(holders.eross, endersGate.address, 232);

    const config = Object.entries(baseConfig).map((entry) => ({
        account: entry[0],
        rewards: entry[1],
    }));

    if (findDuplicates(config.map(({account}) => account)).length > 0)
        throw new Error("config dupliacte");

    return {
        config,
        contractBalance,
    };
};

const sliceInChunks = (array: unknown[], chunkSize: number) => {
    const chunks: unknown[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
};

export const configureAirdrop = async (
    hre: HardhatRuntimeEnvironment,
    configuration: ReturnType<typeof getAirdropConfig>,
    airdrop: PacksAirdrop,
    endersGate: EndersGate,
    packs: EndersPack
) => {
    const {config, contractBalance} = configuration;
    const configEnders = contractBalance[endersGate.address];
    const configPacks = contractBalance[packs.address];

    console.log("Minting endersGate");
    await endersGate.mintBatch(
        airdrop.address,
        Object.keys(configEnders),
        Object.values(configEnders),
        Object.keys(configEnders).map(() => "")
    );

    console.log("Minting packs");
    await packs.mintBatch(
        airdrop.address,
        Object.keys(configPacks),
        Object.values(configPacks),
        []
    );

    for (let i = 0; i < config.length; i++) {
        for (let j = 0; j < i; j++) {
            if (config[i].account === config[j].account) {
                console.log("HERE");
                throw new Error("Bug");
            }
        }
    }

    const chunks = sliceInChunks(config, 200) as typeof config[];
    console.log("Creating chunks", chunks.length);
    const alreadyConfigured: Record<string, boolean> = {};
    await Promise.all(
        chunks.map((i) => {
            const wallets = i.map(({account}) => {
                alreadyConfigured[account] = true;
                return account;
            });
            const amounts = i.map(({rewards}) => rewards.map(({amount}) => amount));
            const ids = i.map(({rewards}) => rewards.map(({tokenId}) => tokenId));
            const tokens = i.map(({rewards}) => rewards.map(({token}) => token));

            return airdrop.setReward(wallets, amounts, ids, tokens);
        })
    );
};
