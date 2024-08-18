<script lang="ts">
  import { dndzone, TRIGGERS } from "svelte-dnd-action";
    import { activeAbility, defaultAbility, dragging, selectedIndex } from "../barStore";
    import type { BarAbility } from "../models/abilities";

    export let barNumber;
    export let items: BarAbility[];
    let abilities = [...items];
    const flipDurationMs = 300;

    let keybind: string[] = [];
    let hasModifier = false;
    let shouldListen = false;
    let itemToAdd: BarAbility;
    let considerIndex: number;

    const handleKeydown  = (event: KeyboardEvent) => {
        console.log("Keydown: ", event.key);
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
            abilities[$selectedIndex!] = $activeAbility;
            //reset state
            $activeAbility = $defaultAbility;
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

    function handleConsider(e: any) {
        console.log("Considering from ActionBar", e.detail);
        const { trigger, id } = e.detail.info;
        if ( trigger === TRIGGERS.DRAGGED_OVER_INDEX) {
            const newItem = e.detail.items.find((x: BarAbility) => x.id === id);
            console.log("new item: ", newItem);
            const idx = e.detail.items.indexOf(newItem);
            const newAbilities = [...abilities];
            console.log("new abilities: ", newAbilities);
            newAbilities[idx] = newItem;
            abilities = [...newAbilities];
        }
    }

    function handleFinalize(e: any) {
        console.log("Finalizing from ActionBar", e.detail);
        abilities = e.detail.items
    }

</script>

<h1 class="header">Action Bar {barNumber}</h1>
<div class="bar" use:dndzone={{items: abilities, flipDurationMs}}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
>
    {#each abilities as ability, index}
    <div class="image"
        on:click={() => handleClick(ability, index)} 
        on:keydown={(event) => handleKeydown(event)} 
        tabindex={index} 
        role="button"
    >
        <img
            class="drop-zone"
            src="Images/{ability.img}" 
            alt="The {ability.name} ability"
        />
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