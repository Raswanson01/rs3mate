<script lang="ts">
  import { dndzone } from "svelte-dnd-action";
  import type { BarAbility, Rotation } from "../../models/abilities";
  import AbilitySelection from "../../components/AbilitySelection.svelte";
  import type { AbilityMap } from "../../data/abilities";
  import Select from "svelte-select";
  import DndAbilitySelection from "../../components/DndAbilitySelection.svelte";

    export let data: any;
    export let abilities: AbilityMap = data.abilities;
    export let rotations = data.rotations;

    let selectedRotation: Rotation;
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
    <div class="left">
        <h1>Rotation Builder</h1>
        <div class="rotation-zone">
            
            <div class="w-5 h-20" use:dndzone={{items, flipDurationMs: 300}}
                on:consider={handleConsider}
                on:finalize={handleFinalize}
            >
                <div>
                    {#each items as item}
                        <img src="Images/{item.img}" alt="The {item.name} ability"/>
                    {/each}
                </div>
            </div>
            
        </div>
        <div class="select">
            <Select  bind:value={selectedRotation} items={rotations} label={"name"}/>
                
        </div>
    </div>
    
    <DndAbilitySelection abilityMap={abilities}/>
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
        flex: 5;
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
    .left {
        flex: 5;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 10px;
    }
    .select {
        margin-top: 10px;
        max-height: 200px;
    }
</style>