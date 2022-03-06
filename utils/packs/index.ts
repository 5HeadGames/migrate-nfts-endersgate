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

type Class = {
    id: number;
    types: {amount: number; id: number}[];
    probability: number;
};

type Card = {
    id: number;
    name: CardTypes;
    classes: {id: number}[];
};

class PacksConfig {
    NUM_TYPES: number;
    NUM_CLASSES: number;
    NUM_CARDS: number;
    COMMON_ID = 0;
    RARE_ID = 1;
    EPIC_ID = 2;
    LEGENDARY_ID = 3;
    classes: Class[];
    types: Type[];
    cards: Card[];

    constructor(_types: Type[], _classes: Class[], _cards: Card[]) {
        this.types = _types;
        this.classes = _classes;
        this.cards = _cards;
        this.NUM_TYPES = _types.length;
        this.NUM_CLASSES = _classes.length;
        this.NUM_CARDS = _cards.length;
    }

    getCountsInReceipt(receipt: ContractReceipt, endersGate: EndersGate) {
        const eventLogs = getEventLogs(
            endersGate.interface,
            receipt.logs,
            ({address, args, name}) => address === endersGate.address
        ).filter(({name, args}) => name === "TransferSingle" || name === "TransferBatch");

        const uniqueSent = eventLogs.reduce((acc, {args}) => {
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
                [nftType.id]: (acc[nftType.id] || 0) + cur.amount,
            };
        }, {} as Record<number, number>);

        return {types, sent};
    }

    getTypesOfCard(cardId: number): Record<number, 1> {
        const card = this.getCard(cardId);
        const classes = card.classes.map(({id}) => this.getClass(id));
        return classes.reduce(
            (acc, cur) => ({
                ...acc,
                ...cur.types.reduce((acc, cur) => ({
                    ...acc,
                    [cur.id]: 1,
                }), {}),
            }),
            {}
        );
    }

    getTypeMintedOfClass({totalMinted, classId, typeId}: {totalMinted: number, classId: number, typeId: number}) {
        const rawClass = this.getClass(classId)
        const averageMinted = this.getAverageMintedOfClass({totalMinted, classId})
        const totalTypes = rawClass.types.reduce((acc, cur) => acc + cur.amount, 0)
        const typeAmount = rawClass.types.find(type => type.id === typeId)?.amount || 0

        return (averageMinted / totalTypes) * typeAmount
    }

    getAverageMintedOfClass({totalMinted, classId}: {totalMinted: number, classId: number}) {
        return totalMinted / 10000 * this.classes[classId].probability
    }

    getAverageMintedOfCard({cardId, amountMinted}: {cardId: number; amountMinted: number}) {
        return this.getCard(cardId)
            .classes.reduce((acc, {id}) => {
                return acc.map((typeAmount, typeId) => typeAmount + this.getTypeMintedOfClass({
                    classId: id, typeId, totalMinted: amountMinted
                }))
            }, [0, 0, 0, 0]);
    }

    getNftType(nftId: number) {
        const type = this.types.find(({nftsIds}) => nftsIds.some((id) => id === nftId));
        if (type === undefined) throw new Error(`NFT ${nftId} TYPE NOT FOUND`);
        return type;
    }

    getType(id: number) {
        return this.types[id];
    }

    getClass(id: number) {
        return this.classes[id];
    }

    getCard(id: number) {
        return this.cards[id];
    }
}

let packsConfig: PacksConfig;

const parseType = (name: TypeName, id: number): Type => ({
    name,
    id,
    nftsIds: AllNfts[name].map(
        ({properties: {id}}: {properties: {id: {value: number}}}) => id.value
    ),
});

export const getPacksConfig = () => {
    const types: Type[] = [
        parseType("wood", 0),
        parseType("stone", 1),
        parseType("gold", 2),
        parseType("legendary", 3),
    ];
    const classes: Class[] = [
        {
            types: [{amount: 5, id: 0}],
            probability: 6000,
        },
        {
            types: [
                {amount: 4, id: 0},
                {amount: 1, id: 1},
            ],
            probability: 4000,
        },
        {
            types: [
                {amount: 4, id: 1},
                {amount: 1, id: 2},
            ],
            probability: 500,
        },
        {
            types: [{amount: 5, id: 1}],
            probability: 2000,
        },
        {
            types: [
                {amount: 4, id: 1},
                {amount: 1, id: 0},
            ],
            probability: 2500,
        },
        {
            types: [
                {amount: 3, id: 1},
                {amount: 2, id: 0},
            ],
            probability: 2500,
        },
        {
            types: [
                {amount: 2, id: 1},
                {amount: 3, id: 0},
            ],
            probability: 2500,
        },
        {
            types: [
                {amount: 4, id: 2},
                {amount: 1, id: 3},
            ],
            probability: 500,
        },
        {
            types: [{amount: 5, id: 2}],
            probability: 1000,
        },
        {
            types: [
                {amount: 4, id: 2},
                {amount: 1, id: 1},
            ],
            probability: 1500,
        },
        {
            types: [
                {amount: 3, id: 2},
                {amount: 2, id: 1},
            ],
            probability: 3500,
        },
        {
            types: [
                {amount: 2, id: 2},
                {amount: 3, id: 1},
            ],
            probability: 3500,
        },
        {
            types: [
                {amount: 1, id: 3},
                {amount: 4, id: 2},
            ],
            probability: 3500,
        },
        {
            types: [
                {amount: 2, id: 3},
                {amount: 3, id: 2},
            ],
            probability: 3000,
        },
        {
            types: [
                {amount: 3, id: 3},
                {amount: 2, id: 2},
            ],
            probability: 20,
        },
        {
            types: [
                {amount: 4, id: 3},
                {amount: 1, id: 2},
            ],
            probability: 15,
        },
    ].map((c, i) => ({...c, id: i}));

    let cardsClassCount = 0;
    const getCard = (name: CardTypes, classes: number) => ({
        name,
        classes: new Array(classes).fill(0).map(() => ({id: cardsClassCount++})),
    });

    const cards: Card[] = [
        getCard("common", 2),
        getCard("rare", 5),
        getCard("epic", 5),
        getCard("legendary", 4),
    ].map((c, i) => ({...c, id: i}));

    if (!packsConfig) packsConfig = new PacksConfig(types, classes, cards);
    return packsConfig;
};
