import {PacksAirdrop} from "../../types";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {loadJsonFile} from "..";

const airdropAddresses = loadJsonFile("airdrop.json") as Record<string, string[]>;

export const configureAirdrop = async (hre: HardhatRuntimeEnvironment, airdrop: PacksAirdrop) => {
    const context = loadJsonFile(`addresses.${hre.network.name}.json`);
    const rewards = [
        {
            addresses: airdropAddresses["packs:epic"],
            tokenId: 2,
            token: context.pack,
            id: 1,
            amount: 1,
        },
        {
            addresses: airdropAddresses["packs:rare"],
            tokenId: 1,
            token: context.pack,
            id: 2,
            amount: 1,
        },
        {
            addresses: airdropAddresses["cards:231"],
            tokenId: 231,
            token: context.endersGate,
            id: 3,
            amount: 1,
        },
        {
            addresses: airdropAddresses["cards:232"],
            tokenId: 232,
            token: context.endersGate,
            id: 4,
            amount: 1,
        },
    ];

    for (let rew of rewards) {
        await airdrop.setReward(rew.id, rew.amount, rew.tokenId, rew.token);
        await airdrop.setAddresses(
            rew.id,
            rew.addresses,
            rew.addresses.map(() => true)
        );
    }
    return rewards;
};
