import type { BarAbility } from "../models/abilities";

export interface AbilityMap {
    melee: BarAbility[];
    range: BarAbility[];
    magic: BarAbility[];
    necromancy: BarAbility[]
    defense: BarAbility[];
    constitution: BarAbility[];
    prayer: BarAbility[];
    spells: BarAbility[]
}

export type BarConfig = {
    id: number;
    name: string;
    mainBarSetupId: number;
    barSetup1Id: number;
    barSetup2Id: number;
    barSetup3Id: number;
    barSetup4Id: number;
}