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