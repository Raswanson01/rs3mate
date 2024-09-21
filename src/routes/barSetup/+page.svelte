<script lang="ts">
	import { goto } from "$app/navigation";
	import { writeTextFile } from "@tauri-apps/api/fs";
	import { appLocalDataDir, join, resourceDir } from '@tauri-apps/api/path';
	import { activeAbility, selectedIndex } from "../../barStore";
  	import ActionBar from "../../components/ActionBar.svelte";
	import Button from "../../components/Button.svelte";
  	import type { AbilityMap } from "../../data/abilities";
	import AbilitySelection from "../../components/AbilitySelection.svelte";
  	import { fs } from "@tauri-apps/api";
	import { defaultAbility } from "../../barStore";

	export let data: any;
	export let abilities: AbilityMap = data.abilities;
	export let barConfig = data.barConfig;

	let newConfigName = "";
	let barConfigState = [...barConfig];
	let selectedBarConfig = barConfigState[0];

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
		const configToAdd = {
			name: newConfigName,
			bars: 
			{
				bar1: Array.from({ length: 14 }, () => ({ ...$defaultAbility })),
				bar2: Array.from({ length: 14 }, () => ({ ...$defaultAbility })),
				bar3: Array.from({ length: 14 }, () => ({ ...$defaultAbility })),
				bar4: Array.from({ length: 14 }, () => ({ ...$defaultAbility }))
			}
		}
		newConfigs.push(configToAdd);
		const appLocalDataDirPath = await appLocalDataDir();
		const barConfigPath = await join(appLocalDataDirPath, "barConfig.json");
		const writeResult = await fs.writeTextFile(barConfigPath, JSON.stringify(newConfigs));
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
		<select bind:value={selectedBarConfig} class="selecterino" >
			{#each barConfigState as config}
				<option value={config}>{config.name}</option>
			{/each}
		</select>
		<input class="p-3 bg-[rgb(70,70,70)] rounded-lg mx-3" bind:value={newConfigName} placeholder="Add new"/>
		<Button text="Add" onClick={handleAddNew} />
		
		<div style="margin-left: 16px;">
			<strong>Active Ability</strong>
			<h1>Ability: { $activeAbility.name }</h1>
			<h1>Keybind: { $activeAbility.keybind ? $activeAbility.keybind : "None" }</h1>
			<h1>Slot: {$selectedIndex !== null ? $selectedIndex + 1 : "None"}</h1>
		</div>
	</div>
	
	<div class="box">
		<div class="ability-select">
			<AbilitySelection on:dragstart on:drop on:dragover abilityMap={abilities}/>
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

	.ability-select {
		flex: 2;
		margin-top: 30px;
	}
	.vert {
		flex: 7
	}
	.selecterino {
		width: 15em;
		height: 3em;
		padding: 12px;
		border-radius: 15px;
		color: white;
		background: rgb(70, 70, 70);
		border-color: white;
	}
</style>