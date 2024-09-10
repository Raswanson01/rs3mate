import { readable, writable } from 'svelte/store';
import type { BarAbility } from './models/abilities';

const base = {
    name: null, 
    keybind: null, 
    img: "empty.png",
    cooldown: 0
}

const keyMap = new Map();
keyMap.set("!", "1");
keyMap.set("@", "2");
keyMap.set("#", "3");
keyMap.set("$", "4");
keyMap.set("%", "5");
keyMap.set("^", "6");
keyMap.set("&", "7");
keyMap.set("*", "8");
keyMap.set("(", "9");
keyMap.set(")", "0");
keyMap.set("_", "-");
keyMap.set("+", "=");

export const shiftedKeyMap = readable<Map<string, string>>(keyMap);
export const defaultAbility = readable<BarAbility>({ id: Math.random()* 1000000, ...base})
export const activeAbility = writable<BarAbility>({id: Math.random()* 1000000, ...base});

export const selectedIndex = writable<number | null>(null);
export const dragging = writable<BarAbility | null>(null);