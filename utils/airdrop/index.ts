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
    let baseConfig: Record<string, Reward[]> = {};
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
        let bal: any = {};
        elements.forEach(({account, balance}) => {
            const reward = {token, tokenId, amount: balance};
            if (bal[account]) bal[account].push(reward);
            else bal[account] = [reward];
            addBalance(token, tokenId, balance);
        });
        return bal;
    };

    baseConfig = parseConfig(minters.dracul, packs.address, 3);
    baseConfig = {...baseConfig, ...parseConfig(minters.eross, packs.address, 2)};
    baseConfig = {...baseConfig, ...parseConfig(holders.dracul, endersGate.address, 231)};
    baseConfig = {...baseConfig, ...parseConfig(holders.eross, endersGate.address, 232)};

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
    const holdersDracul = [...new Set(holders.dracul)];
    const holdersEross = [...new Set(holders.eross)];
    const mintersDracul = [...new Set(minters.dracul)];
    const mintersEross = [...new Set(minters.eross)];

    const [dominicId, etnorId, rareId, epicId] = [231, 232, 1, 2];
    const dominicAmount = holdersDracul.reduce((acc, cur) => acc + cur.balance, 0);
    const etnorAmount = holdersEross.reduce((acc, cur) => acc + cur.balance, 0);
    const epicAmount = mintersDracul.reduce((acc, cur) => acc + cur.balance, 0);
    const rareAmount = mintersEross.reduce((acc, cur) => acc + cur.balance, 0);
    console.log({dominicId, etnorId, rareId, epicId});

    console.log("mint dominic");
    //await endersGate.mint(airdrop.address, dominicId, dominicAmount, "");
    console.log("mint ertnor");
    //await endersGate.mint(airdrop.address, etnorId, etnorAmount, "");
    console.log("mint rare");
    await (packs as any).mint(airdrop.address, rareId, rareAmount, []);
    console.log("mint epic");
    await (packs as any).mint(airdrop.address, epicId, epicAmount, []);

    console.log("holders dracul");
    await airdrop.setReward(
        holdersDracul.map(({account}) => account),
        holdersDracul.map(({balance}) => [balance]),
        holdersDracul.map(() => [dominicId]),
        holdersDracul.map(() => [endersGate.address])
    );
    console.log("holders eross");
    await airdrop.setReward(
        holdersEross.map(({account}) => account),
        holdersEross.map(({balance}) => [balance]),
        holdersEross.map(() => [etnorId]),
        holdersEross.map(() => [endersGate.address])
    );
    console.log("minters dracul");
    await airdrop.setReward(
        mintersDracul.map(({account}) => account),
        mintersDracul.map(({balance}) => [balance]),
        mintersDracul.map(() => [epicId]),
        mintersDracul.map(() => [packs.address])
    );

    const eross1 = mintersEross.slice(0, 200);
    console.log("minters eross 1", eross1.length);
    await airdrop.setReward(
        eross1.map(({account}) => account),
        eross1.map(({balance}) => [balance]),
        eross1.map(() => [rareId]),
        eross1.map(() => [packs.address])
    );

    const eross2 = mintersEross.slice(200);
    console.log("minters eross 2", eross2.length);
    await airdrop.setReward(
        eross2.map(({account}) => account),
        eross2.map(({balance}) => [balance]),
        eross2.map(() => [rareId]),
        eross2.map(() => [packs.address])
    );
};
