<script lang="ts">
    import type { AbilityMap } from '../data/abilities';
    import { flip } from 'svelte/animate';
    import { rotationItems } from '../routes/rotationBuilder/rotationStore';
  import type { BarAbility } from '../models/abilities';
  
    export let abilityMap: AbilityMap;

    let selectedCategory: 'melee' | 'range' | 'magic' | 'necromancy' | 'defense' | 'constitution' | 'spells' = 'melee';
    $: items = abilityMap[selectedCategory];

    function handleClick(item: BarAbility) {
        const newId = `${item.id}_copy_${Math.round(Math.random()*100000)}`
        const newItem = { ...item, id: newId }
        $rotationItems = [...$rotationItems, newItem];
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
        <button class="type-selector" on:click={() => selectedCategory = 'spells'}>
            <img src="Images/Air_Wave.png" alt="Spells" />
        </button>
    </div>
    <section
          class="flex flex-wrap flex-row"
    >
        {#each items as item, index (`${item.id} + ${index}`)}
        <button>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <img on:click={() => handleClick(item)}
                class="item" src="Images/{item.img}"alt="The {item.name} ability"
            />
        </button>
  
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