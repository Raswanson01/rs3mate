import { writable } from "svelte/store";
import type { BarAbility } from "../../models/abilities";

export const rotationItems = writable<BarAbility[]>([]);