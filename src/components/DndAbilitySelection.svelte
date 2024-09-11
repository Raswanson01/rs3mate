<script lang="ts">
    import type { AbilityMap } from '../data/abilities';
    import type { BarAbility } from '../models/abilities';
    import { flip } from 'svelte/animate';
    import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
  
    export let abilityMap: AbilityMap;

    let selectedCategory: 'melee' | 'range' | 'magic' | 'necromancy' | 'defense' | 'constitution' = 'melee';
    $: items = abilityMap[selectedCategory];
    let shouldIgnoreDndEvents = false;

    function handleConsider(e: any) {
        console.warn(`got consider ${JSON.stringify(e.detail, null, 2)}`);
        const {trigger, id} = e.detail.info;
        if (trigger === TRIGGERS.DRAG_STARTED) {
            console.warn(`copying ${id}`);
            const idx = items.findIndex(item => item.id === id);
            const newId = `${id}_copy_${Math.round(Math.random()*100000)}`;
						// the line below was added in order to be compatible with version svelte-dnd-action 0.7.4 and above 
					  e.detail.items = e.detail.items.filter((item: any) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
            e.detail.items.splice(idx, 0, {...items[idx], id: newId});
            items = e.detail.items;
            shouldIgnoreDndEvents = true;
        }
        else if (!shouldIgnoreDndEvents) {
            items = e.detail.items;
        }
        else {
            items = [...items];
        }
    }

    function handleFinalize(e: any) {
        console.warn(`got finalize ${JSON.stringify(e.detail, null, 2)}`);
        if (!shouldIgnoreDndEvents) {
            items = e.detail.items;
        }
        else {
            items = [...items];
            shouldIgnoreDndEvents = false;
        }
    }
  
  </script>
  <div class="container">
    <div class="selectors">
        <button class="type-selector" on:click={() => selectedCategory = 'melee'}>
            <img src="AbilityCategories/Melee.png" alt="Melee abilities" />
        </button>
        <button class="type-selector "on:click={() => selectedCategory = 'range'}>
            <img src="AbilityCategories/Ranged.png" alt="Ranged abilities" />
        </button>
        <button class="type-selector" on:click={() => selectedCategory = 'magic'}>
            <img src="AbilityCategories/Magic.png" alt="Ranged abilities" />
        </button>
        <button class="type-selector" on:click={() => selectedCategory = 'necromancy'}>
            <img src="AbilityCategories/Necromancy.png" alt="Necromancy abilities" />
        </button>
        <button class="type-selector" on:click={() => selectedCategory = 'defense'}>
            <img src="AbilityCategories/Defence.png" alt="Defensive abilities" />
        </button>
        <button class="type-selector" on:click={() => selectedCategory = 'constitution'}>
            <img src="AbilityCategories/Constitution.png" alt="Constitution abilities" />
        </button>
    </div>
    <section
          class="flex flex-wrap flex-row" 
          use:dndzone={{items, flipDurationMs: 300}} 
          on:consider={handleConsider}
          on:finalize={handleFinalize}
    >
        {#each items as item(item.id)}
            <img
                animate:flip              
                class="item" src="Images/{item.img}"alt="The {item.name} ability"/>
        {/each}
    </section>
  </div>

  
  <style>
      .item {
          border-radius: 2px;
          border-width: 1px;
          margin-top: 15px;
          margin-right: 16px;
          padding: 2px;
          width: 50px;
          height: 50px;
      }
      .container {
          flex: 2;
          flex-wrap: wrap;
          display: flex;
          flex-direction: row;
      }
      .type-selector {
          border-style: solid;
          border-radius: 5px;
          border-color: rgb(70, 70, 70);
          border-width: 1px;
          margin-top: 10px;
          width: 50px;
          height: 50px;
          padding: 4px;
      }
      .type-selector:hover {
        filter: brightness(1.1)
    }
    .type-selector:active {
        filter: brightness(0.5);
    }
  </style>