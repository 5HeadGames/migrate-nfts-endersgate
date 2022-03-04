type ClassName = "common" | "rare" | "epic" | "legendary";

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
    name: ClassName;
    types: number[];
};

class PacksConfig {
    NUM_TYPES: number;
    NUM_CLASSES: number;
    classes: Record<number, Class>;
    types: Record<number, Type>;

    constructor(_classes: Record<number, Class>, _types: Record<number, Type>) {
        this.classes = _classes;
        this.types = _types;
        this.NUM_CLASSES = Object.keys(_classes).length
        this.NUM_TYPES = Object.keys(_types).length
    }

    getClass(id: number) {
        return this.classes[id];
    }

    getType(id: number) {
        return this.types[id];
    }
}

let packsConfig: PacksConfig;

export const getPacksConfig = () => {
    //if (!packsConfig)
    //packsConfig = new PacksConfig();
    //return packsConfig;
}
