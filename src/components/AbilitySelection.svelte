<script lang="ts">
  import type { AbilityMap } from '../data/abilities';
  import type { BarAbility } from '../models/abilities';
  import { flip } from 'svelte/animate';

    export let abilityMap: AbilityMap;

	let selectedCategory: 'melee' | 'range' | 'magic' | 'necromancy' | 'defense' | 'constitution' | 
    'spells' = 'melee';
	$: categoryAbilities = abilityMap[selectedCategory];

    function handleConsider(event: DragEvent, item: BarAbility) {
        console.log("Item: ", item);
        event.dataTransfer?.setData("text/plain", JSON.stringify(item));
        console.log("Event: ", event);
    }

</script>

<div class="column">
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
<section class="container" draggable={true}>
    {#each categoryAbilities as item(item.id)}
        <img
            animate:flip
            draggable={true}
            on:dragstart={event => handleConsider(event, item)}
            class="item" src="Images/{item.img}"alt="The {item.name} ability"/>
    {/each}
</section>

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