<script lang="ts">
	import { goto } from "$app/navigation";
  	import type { ComboBoxItem } from "carbon-components-svelte/src/ComboBox/ComboBox.svelte";
  	import { activeAbility, selectedIndex } from "../../barStore";
  	import ActionBar from "../../components/ActionBar.svelte";
	import Button from "../../components/Button.svelte";
  import AbilitySelection from "./AbilitySelection.svelte";

	const bar1 = [
		{ keybind: "Q", imagePath: "Anticipation.png", abilityName: "Anticipation" },
		null,
		null,
		{ keybind: null, imagePath: "Assault.png", abilityName: "Assault" }
	]

	let selectedCategory: 'melee' | 'ranged' | 'magic' | 'necromancy' | 'defence' = 'melee';
		
</script>

<div class="container">
	
	<div class="vert">
		<ActionBar barNumber={1} abilities={[]} />
		<ActionBar barNumber={2} abilities={bar1} />
		<ActionBar barNumber={3} abilities={[]} />
		<ActionBar barNumber={4} abilities={[]} />
		<Button onClick={() => goto("/")} text="Return to landing" />
		<div style="margin-left: 16px;">
			<strong>Active Ability</strong>
			<h1>Ability: { $activeAbility.abilityName }</h1>
			<h1>Keybind: { $activeAbility.keybind ? $activeAbility.keybind : "None" }</h1>
			<h1>Slot: {$selectedIndex !== null ? $selectedIndex + 1 : "None"}</h1>
		</div>
	</div>
	
	<div class="column">
		<button class="type-selector" on:click={() => selectedCategory = 'melee'}>
			<img src="AbilityCategories/Melee.png" alt="Melee abilities" />
		</button>
		<button class="type-selector "on:click={() => selectedCategory = 'ranged'}>
			<img src="AbilityCategories/Ranged.png" alt="Ranged abilities" />
		</button>
		<button class="type-selector" on:click={() => selectedCategory = 'magic'}>
			<img src="AbilityCategories/Magic.png" alt="Ranged abilities" />
		</button>
		<button class="type-selector" on:click={() => selectedCategory = 'necromancy'}>
			<img src="AbilityCategories/Necromancy.png" alt="Necromancy abilities" />
		</button>
		<button class="type-selector" on:click={() => selectedCategory = 'defence'}>
			<img src="AbilityCategories/Defence.png" alt="Defensive abilities" />
		</button>
	</div>
	<div class="ability-select">
		<AbilitySelection {selectedCategory} />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
	}
	.column {
		display: flex;
		flex-direction: column;
		margin-top: 20px;
		margin-left: 30px;
		margin-right: 30px;
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
		margin-top: 30px;
	}
</style>