import {ContractReceipt} from "ethers";

import {getEventLogs} from "../";
import {EndersGate} from "../../types";

const AllNfts = require("../../cards.json");

type CardTypes = "common" | "rare" | "epic" | "legendary";

type TypeName =
    | "reaction"
    | "action"
    | "wood"
    | "stone"
    | "iron"
    | "gold"
    | "legendary"
    | "avatars";

type Type = {
    name: TypeName;
    nftsIds: number[];
    id: number;
};

type Card = {
    id: number;
    name: CardTypes;
    mintLimit: number;
    types: {id: number; inferiorLimit: number; superiorLimit: number}[];
};

export class PacksConfig {
    NUM_TYPES: number;
    NUM_CARDS: number;
    COMMON_ID = 0;
    RARE_ID = 1;
    EPIC_ID = 2;
    LEGENDARY_ID = 3;
    types: Type[];
    cards: Card[];

    constructor(_types: Type[], _cards: Card[]) {
        this.types = _types;
        this.cards = _cards;
        this.NUM_TYPES = _types.length;
        this.NUM_CARDS = _cards.length;
    }

    getCountsInReceipt(receipt: ContractReceipt, endersGate: EndersGate) {
        const eventLogs = getEventLogs(
            endersGate.interface,
            receipt.logs,
            ({address, args, name}) => address === endersGate.address
        ).filter(({name, args}) => name === "TransferSingle" || name === "TransferBatch");

        const uniqueSent = eventLogs.reduce((acc, log) => {
            const {args} = log;
            const id = Number(args[3]),
                to = args[2],
                amount = Number(args[4]);

            return {
                ...acc,
                [id]: {
                    id,
                    to,
                    amount: amount + (acc[id]?.amount || 0),
                },
            };
        }, {} as Record<number, {amount: number; to: string; id: number}>);
        const sent = Object.values(uniqueSent) as {amount: number; to: string; id: number}[];

        const types = sent.reduce((acc, cur) => {
            const nftType = packsConfig.getNftType(cur.id);
            return {
                ...acc,
                [nftType.name]: (acc[nftType.name] || 0) + cur.amount,
            };
        }, {} as Record<string, number>);

        const typesByID = sent.reduce((acc, cur) => {
            const nftType = packsConfig.getNftType(cur.id);
            return {
                ...acc,
                [nftType.id]: (acc[nftType.id] || 0) + cur.amount,
            };
        }, {} as Record<string, number>);

        return {types, typesByID, sent};
    }

    getTypeAverage(cardId: number, typeId: number, cardsAmount: number) {
        const totalNfts = cardsAmount * 5;
        const card = this.getCard(cardId);
        const type = card.types.find(({id}) => id === typeId);

        if (!type) throw new Error(`Type ${typeId} doesnt belong to card ${cardId}`);

        const assured = card.types.reduce((acc, cur) => cur.inferiorLimit + acc, 0);
        const totalAssured = assured * cardsAmount;
        const noAssured = totalNfts - totalAssured;
        const amountAssured = type.inferiorLimit * cardsAmount;
        const mintLeft = type.superiorLimit - type.inferiorLimit;

        return noAssured / card.types.length + amountAssured;
    }

    getNftType(nftId: number) {
        const type = this.types.find(({nftsIds}) => nftsIds.some((id) => id === nftId));
        if (type === undefined) throw new Error(`NFT ${nftId} TYPE NOT FOUND`);
        return type;
    }

    getType(id: number) {
        return this.types[id];
    }

    getCard(id: number) {
        return this.cards[id];
    }
}

let packsConfig: PacksConfig;

//TODO!!!!! REMOVE EROSS FROM THE CONFIGURATION, MAKE IT UNABLE TO BE MINTED
const parseType = (name: TypeName): Omit<Type, "id"> => ({
    name,
    nftsIds: AllNfts[name].map(
        ({properties: {id}}: {properties: {id: {value: number}}}) => id.value
    ),
});

export const getPacksConfig = () => {
    const types: Type[] = [
        parseType("reaction"),
        parseType("action"),
        parseType("wood"),
        parseType("stone"),
        parseType("iron"),
        parseType("gold"),
        parseType("legendary"),
    ].map((type, id) => ({...type, id}));

    const getCardType = (name: TypeName, inferiorLimit: number, superiorLimit: number) => {
        const id = types.find((t) => t.name === name)?.id;

        if (id === undefined) throw new Error(`Type not found:${name}`);

        return {
            id,
            inferiorLimit,
            superiorLimit,
        };
    };

    const cards: Card[] = [
        {
            name: "common" as CardTypes,
            mintLimit: 5,
            types: [
                getCardType("wood", 1, 5),
                getCardType("action", 1, 4),
                getCardType("stone", 0, 1),
                getCardType("reaction", 1, 4),
            ],
        },
        {
            name: "rare" as CardTypes,
            mintLimit: 5,
            types: [
                getCardType("action", 1, 4),
                getCardType("reaction", 1, 4),
                getCardType("wood", 0, 3),
                getCardType("stone", 1, 5),
                getCardType("iron", 0, 2),
                getCardType("gold", 0, 1),
            ],
        },
        {
            name: "epic" as CardTypes,
            mintLimit: 5,
            types: [
                getCardType("action", 1, 4),
                getCardType("reaction", 1, 4),
                getCardType("stone", 0, 3),
                getCardType("iron", 0, 5),
                getCardType("gold", 1, 3),
                getCardType("legendary", 0, 1),
            ],
        },
        {
            name: "legendary" as CardTypes,
            mintLimit: 5,
            types: [
                getCardType("action", 1, 4),
                getCardType("reaction", 0, 4),
                getCardType("stone", 0, 1),
                getCardType("iron", 0, 3),
                getCardType("gold", 1, 4),
                getCardType("legendary", 1, 3),
            ],
        },
    ].map((card, id) => ({...card, id}));

    if (!packsConfig) packsConfig = new PacksConfig(types, cards);
    return packsConfig;
};
