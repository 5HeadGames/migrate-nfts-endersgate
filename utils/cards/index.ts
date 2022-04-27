import {getUrlHash} from "../index";

export const formatCardData = (data: Record<string, unknown>) => {
    return {
        name: data.name,
        type: "ERC1155",
        description: data.description,
        image: getUrlHash(data.image as string),
        symbol: "GATE",
        properties: Object.entries(data).reduce(
            (acc, cur) => ({
                ...acc,
                [cur[0]]: {
                    name: cur[0],
                    value: cur[1],
                },
            }),
            {}
        ), //erc1155 standard for properties
        attributes: Object.entries(data).map((entry) => ({
            trait_type: entry[0],
            value: entry[1],
        })), //opensea standard
    };
};
