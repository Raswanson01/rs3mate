export interface BarAbility {
    id: number;
    keybind: string | null;
    name: string | null;
    img: string | null;
    cooldown: number;
}

export interface Rotation {
    name: string;
    abilities: BarAbility[];
}