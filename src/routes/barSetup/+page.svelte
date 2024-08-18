<script lang="ts">
	import { goto } from "$app/navigation";
  	import type { PageData } from "../$types";
  	import { activeAbility, selectedIndex } from "../../barStore";
  	import ActionBar from "../../components/ActionBar.svelte";
	import Button from "../../components/Button.svelte";
  	import type { AbilityMap } from "../../data/abilities";
	import AbilitySelection from "./AbilitySelection.svelte";



	let selectedCategory: 'melee' | 'range' | 'magic' | 'necromancy' | 'defense' | 'constitution' = 'melee';
	export let data: any;
	export let abilities: AbilityMap = data.abilities;
	export let barConfig = data.barConfig;
	$: categoryAbilities = abilities[selectedCategory];
	console.log("Selected category: ", selectedCategory)
</script>

<div class="container">
	
	<div class="vert">
		<ActionBar on:dragend barNumber={1} items={barConfig.bar1} />
		<ActionBar on:dragend barNumber={2} items={barConfig.bar2} />
		<ActionBar on:dragend barNumber={3} items={barConfig.bar3} />
		<ActionBar on:dragend barNumber={4} items={barConfig.bar4} />
		<Button onClick={() => goto("/")} text="Return to landing" />
		<div style="margin-left: 16px;">
			<strong>Active Ability</strong>
			<h1>Ability: { $activeAbility.name }</h1>
			<h1>Keybind: { $activeAbility.keybind ? $activeAbility.keybind : "None" }</h1>
			<h1>Slot: {$selectedIndex !== null ? $selectedIndex + 1 : "None"}</h1>
		</div>
	</div>
	
	<div class="box">
		<div class="column">
			<button class="type-selector" on:click={() => selectedCategory = 'melee'}>
				<img src="AbilityCategories/Melee.png" alt="Melee abilities" />
			</button>
			<button class="type-selector "on:click={() => {console.log("Range clicked");selectedCategory = 'range'}}>
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
		<div class="ability-select">
			<AbilitySelection on:dragend items={categoryAbilities}/>
		</div>
	</div>

</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
	}
	.box {
		display: flex;
		flex: 2;
		flex-direction: column;
	}
	.column {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
		margin-left: 15px;
		margin-right: 15px;
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
	.ability-select {
		flex: 2;
		margin-top: 30px;
	}
	.vert {
		flex: 7
	}
</style>