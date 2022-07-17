import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ContractTransaction} from "ethers";
import {PacksConfig} from ".";
import {EndersGate, EndersPack} from "../../types";

export const setOptionSettings = async ({
    packsConfig,
    packs,
    signer,
}: {
    packsConfig: PacksConfig;
    packs: EndersPack;
    signer: SignerWithAddress;
}) => {
    const txs: Promise<ContractTransaction>[] = [];
    for (let i of packsConfig.cards) {
        txs.push(
            packs.connect(signer).setOptionSettings(
                i.id,
                i.mintLimit,
                i.types.map(({id}) => id),
                i.types.map(({inferiorLimit}) => inferiorLimit),
                i.types.map(({superiorLimit}) => superiorLimit)
            )
        );
    }

    return Promise.all(txs);
};

export const setTokensForTypes = async ({
    packsConfig,
    signer,
    endersGate,
    packs,
}: {
    packsConfig: PacksConfig;
    signer: SignerWithAddress;
    endersGate: EndersGate;
    packs: EndersPack;
}) => {
    const txs: Promise<ContractTransaction>[] = [];

    for (let i of packsConfig.types)
        txs.push(packs.connect(signer).setTokensForTypes(i.id, i.nftsIds));

    return Promise.all(txs);
};
