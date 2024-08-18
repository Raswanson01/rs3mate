import { readable, writable } from 'svelte/store';
import type { BarAbility } from './models/abilities';

const base = {
    name: "None", 
    keybind: null, 
    img: "favicon.png",
    cooldown: 0
}
export const defaultAbility = readable<BarAbility>({ id: Math.random()* 1000000, ...base})
export const activeAbility = writable<BarAbility>({id: Math.random()* 1000000, ...base});

export const selectedIndex = writable<number | null>(null);
export const dragging = writable<BarAbility | null>(null);