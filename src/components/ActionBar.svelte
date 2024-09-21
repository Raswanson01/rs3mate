<script lang="ts">
    import { browser } from "$app/environment";
    import { activeAbility, selectedIndex, shiftedKeyMap } from "../barStore";
    import type { BarAbility } from "../models/abilities";

    export let barNumber;
    export let items: BarAbility[];

    let keybind: string[] = [];
    let hasModifier = false;
    let shouldListen = false;

    const handleKeydown  = (event: KeyboardEvent) => {
        if (!shouldListen) {
            return;
        }
        const key = event.key.toUpperCase();
        if (['ALT', 'CONTROL', 'SHIFT'].includes(key)) {
            let keyToUse;
            switch(key) 
            {
                case "CONTROL":
                    keyToUse = "CTL";
                    break;
                case "SHIFT":
                    keyToUse = "SFT";
                    break;
                default:
                    keyToUse = key;
                    break
            }
            if (!hasModifier) {
                keybind.push(keyToUse);
                hasModifier = true;
            }
            else {
                return;
            }
        } else {
            keybind.push(key);
            if (keybind[0] === "SFT" && keybind.length === 2) {
                keybind[1] = $shiftedKeyMap.get(key)!;
            }
            $activeAbility.keybind = keybind.join('+');
            
            items[$selectedIndex!] = $activeAbility;
            //reset state
            //$activeAbility = $defaultAbility;
            keybind = [];
            shouldListen = false;
            hasModifier = false;
        }
    }

    const handleClick = (ability: BarAbility, index: number) => {
        if (!shouldListen && browser)  {
            window.addEventListener('keydown', handleKeydown);
        }
        $activeAbility = ability;
        $selectedIndex = index;
        shouldListen = true;
    }

    function handleDragover(event: DragEvent) {
        event.preventDefault();
    }

    function handleDrop(event: DragEvent, index: number) {
        const data = event.dataTransfer?.getData("text/plain");
        const abilityToDrop = data ? JSON.parse(data) : null;
        const currentKeybind = items[index].keybind;
        items[index] = {...abilityToDrop, keybind: currentKeybind};

        items = [...items];
    }

</script>

<h1 class="header">Action Bar {barNumber}</h1>
<div class="bar">
    {#each items as ability, index (index)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore missing-declaration -->
        <div class="image"
            on:drop={event => handleDrop(event, index)}
            on:dragover={event => handleDragover(event)}
            on:click|preventDefault={() => handleClick(ability, index)} 
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