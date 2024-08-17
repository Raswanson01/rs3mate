<script lang="ts">
  import { draggable } from "@neodrag/svelte";
    import { activeAbility, selectedIndex } from "../barStore";
    import type { BarAbility } from "../models/abilities";
    import { dndzone } from "svelte-dnd-action";

    const initAbilities = (propAbilities: BarAbility[]): BarAbility[] => {
        let defaultAbilities: BarAbility[] = [];
        for (let i = 0; i < 14; i++) {
            if (propAbilities[i] && propAbilities[i].abilityName) {
                defaultAbilities[i] = {...propAbilities[i], id: i};
            }
            else {
                defaultAbilities[i] = { keybind: null, abilityName: "None", img: "empty.png", id: i, cooldown: 0 }
            }
        }
        return defaultAbilities;
    }

    export let barNumber;
    export let abilities;

    let abilityArray: BarAbility[] = initAbilities(abilities);
    let keybind: string[] = [];
    let hasModifier = false;
    let shouldListen = false;

    const flipDurationMs = 300;

    const handleKeydown  = (event: KeyboardEvent) => {
        if (!shouldListen) {
            return;
        }
        const key = event.key.toUpperCase();
        console.log("Keybind: ", keybind);
        if (['ALT', 'CONTROL', 'SHIFT'].includes(key)) {
            const keyToUse = key === 'CONTROL' ? "CTL" : key;
            if (!hasModifier) {
                keybind.push(keyToUse);
                hasModifier = true;
            }
            else {
                return;
            }
        } else {
            keybind.push(key);
            $activeAbility.keybind = keybind.join('+');
            abilityArray[$selectedIndex!] = $activeAbility;
            //reset state
            keybind = [];
            shouldListen = false;
            hasModifier = false;
        }
    }

    const handleClick = (ability: BarAbility, index: number) => {
        $activeAbility = ability;
        $selectedIndex = index;
        shouldListen = true;
    }

</script>

<h1 class="header">Action Bar {barNumber}</h1>
<div class="bar">
    {#each abilityArray as ability, index}
    <div class="image" 
        on:click={() => handleClick(ability, index)} 
        on:keydown={(event) => handleKeydown(event)} 
        tabindex={index} 
        role="button"
    >
        <img
            class="drop-zone"
            src="Images/{ability.img}" 
            alt="The {ability.abilityName} ability"
        />
        <h7 class="text">{ability.keybind ? ability.keybind : "None"}</h7>
    </div>
    {/each}
    {#each abilityArray as ability}
        <h7>{ability.img}</h7>
    {/each}
</div>

<style>
    .image {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 4em;
        height: 4em;
        border-style: solid;
        border-width: 2px;
        border-color: rgb(70, 70, 70);
        margin-left: 10px;
        margin-top: 8px;
    }
    .image:hover {
       filter: brightness(1.1);
    }
    .image:active {
        filter: brightness(0.5);
    }
    .bar {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .text {
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .header {
        margin-left: 10px;
        margin-top: 8px;
    }
</style>