<script lang="ts">
    import { activeAbility, dragging, selectedIndex } from "../barStore";
    import type { BarAbility } from "../models/abilities";

    export let barNumber;
    export let items: BarAbility[];

    let keybind: string[] = [];
    let hasModifier = false;
    let shouldListen = false;
    let itemToAdd: BarAbility;
    let considerIndex: number;

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
            items[$selectedIndex!] = $activeAbility;
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

    function handleDragEnd(index: number) {
        console.log("Handling drag end")
        const newItems = [...items];
        newItems[index] = $dragging!
        items = newItems;
    }

</script>

<h1 class="header">Action Bar {barNumber}</h1>
<div class="bar">
    {#each items as ability, index}
    <div class="image" on:dragend={() => handleDragEnd(index)}
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