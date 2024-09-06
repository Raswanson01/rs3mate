<script lang="ts">
	import { goto } from "$app/navigation";
	import { writeTextFile } from "@tauri-apps/api/fs";
	import { appLocalDataDir, join, resourceDir } from '@tauri-apps/api/path';
	import { activeAbility, selectedIndex } from "../../barStore";
  	import ActionBar from "../../components/ActionBar.svelte";
	import Button from "../../components/Button.svelte";
  	import type { AbilityMap } from "../../data/abilities";
	import AbilitySelection from "./AbilitySelection.svelte";
	import Select from "svelte-select";
  	import { fs } from "@tauri-apps/api";

	export let data: any;
	export let abilities: AbilityMap = data.abilities;
	export let barConfig = data.barConfig;

	let selectedCategory: 'melee' | 'range' | 'magic' | 'necromancy' | 'defense' | 'constitution' = 'melee';
	let showAdd = false;
	let newConfigName = "";
	let barConfigState = [...barConfig];
	let selectedBarConfig = barConfigState[0];
	$: categoryAbilities = abilities[selectedCategory];

	async function handleSave() {
		const appLocalDataDirPath = await appLocalDataDir();
		const idx = barConfig.findIndex((x: any) => x.name === selectedBarConfig.name);
		barConfig[idx] = selectedBarConfig;
		const pathToSave = await join(appLocalDataDirPath, "barConfig.json");
		console.log("Path to save", pathToSave);
		console.log("bar config: ", barConfig);
		await writeTextFile(pathToSave, JSON.stringify(barConfig));
	}

	async function handleAddNew() {
		const newConfigs = [...barConfigState];
		newConfigs.push({
			name: newConfigName,
			bars: 
			{
				bar1: [],
				bar2: [],
				bar3: [],
				bar4: []
			}

		})
		const appLocalDataDirPath = await appLocalDataDir();
		const barConfigPath = await join(appLocalDataDirPath, "barConfig.json");
		await fs.writeTextFile(barConfigPath, JSON.stringify(newConfigs));
		barConfigState = newConfigs;
	}
      
</script>

<div class="container">
	
	<div class="vert">
		<ActionBar on:drop on:dragstart on:dragover barNumber={1} bind:items={selectedBarConfig.bars.bar1} />
		<ActionBar on:drop on:dragstart on:dragover barNumber={2} bind:items={selectedBarConfig.bars.bar2} />
		<ActionBar on:drop on:dragstart on:dragover barNumber={3} bind:items={selectedBarConfig.bars.bar3} />
		<ActionBar on:drop on:dragstart on:dragover barNumber={4} bind:items={selectedBarConfig.bars.bar4} />
		<Button onClick={() => goto("/")} text="Return to landing" />
		<Button onClick={handleSave} text="Save bar" />
		<Button text="Add new " onClick={() => showAdd = true}/>
		{#if showAdd}
			<input class="add-new" bind:value={newConfigName} placeholder="Add new"/>
			<Button text="Save" onClick={handleAddNew} />
		{/if}
		<Select 
			containerStyles={"background: gray"}
			items={barConfigState}
			on:change={e => {
				console.log("E: ", e.detail)
				selectedBarConfig = e.detail;
			}}
			label="name"
			value={selectedBarConfig}
		>
		</Select>
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
		<div class="ability-select">
			<AbilitySelection on:dragstart on:drop on:dragover items={categoryAbilities}/>
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
	.add-new {
		width: 10em;
		height: 2em;
		padding: 8px;
		color: white;
		background-color: rgb(70, 70, 70);
		border-color: white;
	}
	.selecterino {
		color: white;
		background: rgb(70, 70, 70);
		border-color: white;
	}
</style>