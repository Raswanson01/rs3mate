<script lang="ts">
  import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, TRIGGERS } from "svelte-dnd-action";
    import { activeAbility, defaultAbility, selectedIndex } from "../barStore";
    import type { BarAbility } from "../models/abilities";

    export let barNumber;
    export let items: BarAbility[];
    const flipDurationMs = 300;

    let keybind: string[] = [];
    let hasModifier = false;
    let shouldListen = false;

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
            items[$selectedIndex!] = $activeAbility;
            //reset state
            //$activeAbility = $defaultAbility;
            keybind = [];
            shouldListen = false;
            hasModifier = false;
        }
    }

    const handleClick = (ability: BarAbility, index: number) => {
        if (shouldListen)  {
            window.addEventListener('keydown', handleKeydown);
        }
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
            const keybind = items[idx].keybind;
            const newAbilities = [...items];
            console.log("new abilities: ", newAbilities);
            console.log("Index: ",idx);
            newItem.keybind = keybind;
            newAbilities[idx] = newItem;
            e.detail.items[idx] = newItem;
            items = [...newAbilities];
        }
        else if ( trigger === TRIGGERS.DRAG_STARTED) {
            console.warn(`copying ${id}`);
            const idx = items.findIndex(item => item.id === id);
            const newId = `${id}_copy_${Math.round(Math.random()*100000)}`;
						// the line below was added in order to be compatible with version svelte-dnd-action 0.7.4 and above 
					  e.detail.items = e.detail.items.filter((item: any) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
            e.detail.items.splice(idx, 0, {...items[idx], id: newId});
            items = e.detail.items;
            //Add a shouldIgnore state?
        }
        else {
            items = [...items]
        }
    }

    function handleFinalize(e: any) {
        console.log("Finalizing from ActionBar", e.detail);
        items = e.detail.items
    }

</script>

<h1 class="header">Action Bar {barNumber}</h1>
<div class="bar" use:dndzone={{items, flipDurationMs}}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
>
    {#each items as ability, index}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="image"
        on:click={() => handleClick(ability, index)} 
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