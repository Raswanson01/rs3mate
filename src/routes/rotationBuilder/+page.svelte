<script lang="ts">
  import { dndzone } from "svelte-dnd-action";
  import type { BarAbility, Rotation } from "../../models/abilities";
  import AbilitySelection from "../barSetup/AbilitySelection.svelte";
  import type { AbilityMap } from "../../data/abilities";
  import Select from "svelte-select";

    let selectedCategory: 'melee' | 'range' | 'magic' | 'necromancy' | 'defense' | 'constitution' = 'melee'; 
    export let data: any;
    export let abilities: AbilityMap = data.abilities;
    export let rotations = data.rotations;

    let selectedRotation: Rotation;
    $: categoryAbilities = abilities[selectedCategory];
    let items: BarAbility[] = []
    console.log("ItemS: ", items);

    function handleConsider(event: any) {
        event.preventDefault();
        items = event.detail.items;
    } 
    function handleFinalize(event: any) {
        event.preventDefault();
        items = event.detail.items;
        console.log("ItemS: ", items);
    } 
</script>

<div class="container">
    <div style="flex: 5;" class="column">
        <h1>Rotation Builder</h1>
        <div class="rotation-zone" use:dndzone={{items, flipDurationMs: 300}}
            on:consider={handleConsider}
            on:finalize={handleFinalize}
        >
        <div style="display: flex; flex-direction: row;">
            {#each items as item}
                <img class="image" src="Images/{item.img}" alt="The {item.name} ability"/>
            {/each}
        </div>

        </div>
        <Select bind:value={selectedRotation} items={rotations} label={"name"}/>
    </div>
    <div class="ability-select">
        <AbilitySelection items={categoryAbilities}/>
    </div>
</div>

<style>
    .container {
        display: flex;
    }
    .rotation-zone {
        display: flex;
        border-width: 2px;
        min-height: 500px;
        flex-wrap: wrap;
        flex-direction: row;
    }
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
    .ability-select {
        flex: 1;
    }
</style>