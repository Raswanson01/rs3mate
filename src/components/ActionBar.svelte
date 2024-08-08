<script lang="ts">
  import { onDestroy } from "svelte";
    import { activeAbility, selectedIndex } from "../barStore";
    import type { BarAbility } from "../models/abilities";

    const initAbilities = (propAbilities: BarAbility[]): BarAbility[] => {
        let defaultAbilities: BarAbility[] = [];
        for (let i = 0; i < 14; i++) {
            if (propAbilities[i] && propAbilities[i].abilityName) {
                defaultAbilities[i] = propAbilities[i];
            }
            else {
                defaultAbilities[i] = { keybind: null, abilityName: "None", imagePath: "favicon.png" }
            }
        }
        return defaultAbilities;
    }

    export let barNumber;
    export let abilities;

    let abilityArray: BarAbility[] = initAbilities(abilities);
    let keybind: string[] = [];
    let hasModifier = false;

    const handleKeydown  = (event: KeyboardEvent) => {
        const key = event.key;
        keybind.push(key)
        if (['Alt', 'Control', 'Shift'].includes(key)) {
            if (hasModifier) {
                return;
            }
            hasModifier = true;
        } else {
            $activeAbility.keybind = keybind.join('+');
            keybind = [];
            window.removeEventListener('keydown', handleKeydown);
            abilityArray[$selectedIndex!] = $activeAbility;
            return;
        }
    }

    const handleClick = (ability: BarAbility, index: number) => {
        $activeAbility = ability;
        $selectedIndex = index;
        window.addEventListener('keydown', handleKeydown)
    }

    
</script>

<h1 class="header">Action Bar {barNumber}</h1>
<div class="bar">
    {#each abilityArray as ability, index}
    <div class="image" 
        on:click={() => handleClick(ability, index)} 
        on:keyup={() => handleClick(ability, index)} 
        tabindex={index} 
        role="button"
    >
        <img src="/ImagesOrigin/{ability.imagePath}" alt="The {ability.abilityName} ability"/>
        <h7 class="text">{ability.keybind ? ability.keybind : "None"}</h7>
    </div>
    {/each}
</div>


<style>
    .image {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3em;
        height: 3em;
        border-style: solid;
        border-width: 2px;
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