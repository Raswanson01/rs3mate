import { readable, writable } from 'svelte/store';
import type { BarAbility } from './models/abilities';

export const defaultAbility = readable<BarAbility>({ abilityName: "None", keybind: null, imagePath: "favicon.png" })
export const activeAbility = writable<BarAbility>({ abilityName: "None", keybind: null, imagePath: "favicon.png" });

export const selectedIndex = writable<number | null>(null);