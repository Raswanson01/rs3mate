<script lang="ts">
	import { goto } from "$app/navigation";
	import { writeTextFile } from "@tauri-apps/api/fs";
	import { activeAbility, selectedIndex } from "../../barStore";
  	import ActionBar from "../../components/ActionBar.svelte";
	import Button from "../../components/Button.svelte";
  	import type { AbilityMap } from "../../data/abilities";
	import AbilitySelection from "../../components/AbilitySelection.svelte";
  	import { fs } from "@tauri-apps/api";
	import { defaultAbility } from "../../barStore";
  	import { appLocalDataDir, join } from "../../lib/tauri-wrapper";
  	import { Tooltip } from "@svelte-plugins/tooltips";
	import HelpIcon from '~icons/mdi/help-circle-outline';

	export let data: any;
	export let abilities: AbilityMap = data.abilities;
	export let barConfig = data.barConfig;

	let newConfigName = "";
	let barConfigState = [...barConfig];
	let selectedBarConfig = barConfigState[0];

	const helpCopy = "Click and drag abilities to action bar slots to set them in their slot. "
	+ "Click on an ability slot and press your desired keybind (e.g. Shift and 3) to configure the tracker to "
	+ "correlate that ability with that keybind."

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

	async function handleDelete() {
		if (barConfigState.length <= 1) {
			alert("Cannot delete last bar config");
			return;
		}
        const barToDelete = barConfigState.findIndex((x: any) => x === selectedBarConfig);
        barConfigState.splice(barToDelete, 1);
        barConfigState = [...barConfigState];
        const localPath = await appLocalDataDir();
        const rotationsPath = await join(localPath, "barConfig.json");
		await fs.writeTextFile(rotationsPath, JSON.stringify(barConfigState));
    }
      
</script>

<div class="flex flex-row">

	<div class="flex flex-col mr-5 w-[70%]">
		<div class="text-xl self-center mt-3">
			<Tooltip
				animation="fade"
				position={"bottom"}
				content={helpCopy}
			>
				<div class="flex flex-row items-center">
					<p class="mx-2">Action bar setup</p>
					<HelpIcon />
				</div>
			</Tooltip>
		</div>
		<ActionBar on:drop on:dragstart on:dragover barNumber={1} bind:items={selectedBarConfig.bars.bar1} />
		<ActionBar on:drop on:dragstart on:dragover barNumber={2} bind:items={selectedBarConfig.bars.bar2} />
		<ActionBar on:drop on:dragstart on:dragover barNumber={3} bind:items={selectedBarConfig.bars.bar3} />
		<ActionBar on:drop on:dragstart on:dragover barNumber={4} bind:items={selectedBarConfig.bars.bar4} />
		<div class="flex flex-row h-20 items-center">
			<Button onClick={() => goto("/")} text="Return to landing" />
			<select bind:value={selectedBarConfig} class="selecterino" >
				{#each barConfigState as config}
					<option value={config}>{config.name}</option>
				{/each}
			</select>
			<input class="p-3 bg-[rgb(70,70,70)] rounded-lg mx-3" bind:value={newConfigName} placeholder="Add new"/>
			<Button text="Add New" onClick={handleAddNew} />
			<Button onClick={handleSave} text="Save bar" />
			<Button onClick={handleDelete} color="red" text="Delete" />
		</div>

		
		<div style="margin-left: 16px;">
			<strong>Active Ability</strong>
			<h1>Ability: { $activeAbility.name }</h1>
			<h1>Keybind: { $activeAbility.keybind ? $activeAbility.keybind : "None" }</h1>
			<h1>Slot: {$selectedIndex !== null ? $selectedIndex + 1 : "None"}</h1>
		</div>
	</div>
	
	<div class="w-[25%]">
		<div>
			<AbilitySelection on:dragstart on:drop on:dragover abilityMap={abilities}/>
		</div>
	</div>

</div>

<style>
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