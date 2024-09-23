export interface BarAbility {
    id: string;
    keybind: string | null;
    name: string | null;
    img: string | null;
    cooldown: number;
}

export interface Rotation {
    name: string;
    abilities: BarAbility[];
}