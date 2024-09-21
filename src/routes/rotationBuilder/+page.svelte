<script lang="ts">
  import type { AbilityMap } from "../../data/abilities";
  import DndAbilitySelection from "../../components/DndAbilitySelection.svelte";
  import { rotationItems } from "./rotationStore";
  import type { Rotation } from "../../models/abilities";
  import Button from "../../components/Button.svelte";
  import { writeTextFile } from "@tauri-apps/api/fs";
  import { fs } from "@tauri-apps/api";
  import { open, save } from "@tauri-apps/api/dialog";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { appLocalDataDir, join } from "../../lib/tauri-wrapper";

    export let data: any;
    export let abilities: AbilityMap = data.abilities;
    export let rotations = data.rotations;

    let rotationsState = rotations;
    let selectedRotation: Rotation = rotationsState[0];
    let selectedIndex: number;
    let shouldListen = false;
    let newRotation = "";

    onMount(() => {
        $rotationItems = selectedRotation.abilities;
    })

    function handleKeydown(event: KeyboardEvent) {
        console.log("Event: ", event);
        if (!shouldListen || event.key.toUpperCase() !== "DELETE") {
            return;
        }
        const newItems = [...$rotationItems]
        newItems.splice(selectedIndex, 1);
        $rotationItems = newItems;
        shouldListen = false;
    }

    function handleClick(index: number) {
        shouldListen = true;
        selectedIndex = index;
        window.addEventListener("keydown", handleKeydown);
    }

    async function handleSave() {
		const appLocalDataDirPath = await appLocalDataDir();
		const idx = rotationsState.findIndex((x: any) => x.name === selectedRotation.name);
        console.log("Selected rot: ", selectedRotation)

        selectedRotation.abilities = $rotationItems;
		rotationsState[idx] = selectedRotation;
		const pathToSave = await join(appLocalDataDirPath, "rotations.json");
		console.log("Path to save", pathToSave);
		console.log("rotations: ", rotationsState);
		await writeTextFile(pathToSave, JSON.stringify(rotationsState));
        rotationsState = [...rotationsState];
	}

    async function handleAddNew() {
        const newRotations = [...rotationsState];
        const rotationToAdd: Rotation = {
            name: newRotation,
            abilities: []
        }
        newRotations.push(rotationToAdd);
        const appLocalDataDirPath = await appLocalDataDir();
		const rotationsPath = await join(appLocalDataDirPath, "rotations.json");
		await fs.writeTextFile(rotationsPath, JSON.stringify(newRotations));
        rotationsState = [...newRotations];
    }

    async function handleImport() {
        const selected = await open({
            filters: [{
                name: "JSON",
                extensions: ["json"]
            }]
        });
        if (!selected || typeof selected !== 'string') {
            return;
        }

        const fileContent = await fs.readTextFile(selected);
        const rotationToAdd = JSON.parse(fileContent);
        rotationsState.push(rotationToAdd);
        const appLocalDataDirPath = await appLocalDataDir();
		const rotationsPath = await join(appLocalDataDirPath, "rotations.json");
		await fs.writeTextFile(rotationsPath, JSON.stringify(rotationsState));
        rotationsState = [...rotationsState]
    }

    async function handleExport() {
        const filePath = await save({
            defaultPath: 'rotation.json', 
            filters: [
                {
                    name: 'JSON',
                    extensions: ['json'],
                },
            ],
        });

        if (!filePath || typeof filePath !== 'string') {
            return;
        }

        const jsonOutput = JSON.stringify(selectedRotation);
        await writeTextFile(filePath, jsonOutput);
    }

</script>

<div class="flex flex-row">
    <div class="w-[70%] h-[75%] mx-3 my-1 min-h-[600px]">
        <h1>Rotation </h1>
        <div class="border-2 p-2 ">
            
            <div class="">
                <div class="flex flex-row flex-wrap">
                    {#each $rotationItems as item, index}
                        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                         <div>
                            <img
                                on:click={() => handleClick(index)}
                                on:keydown={(event) => handleKeydown(event)} 
                                class="image hover:brightness-110 active:brightness-50"
                                src="Images/{item.img}" alt="The {item.name} ability"
                            />
                         </div>
                        
                    {/each}
                </div>
            </div>
            
        </div>
        <div class="flex-row m-4">
            <select class="p-3 w-[50%] bg-[rgb(70,70,70)] rounded-lg" 
                placeholder="Select rotation" 
                bind:value={selectedRotation}
                on:change={() => $rotationItems = selectedRotation.abilities}
            >
                {#each rotationsState as rotation}
                    <option value={rotation}>{rotation.name}</option>
                {/each}
            </select>
            <Button text="Save Rotation" onClick={handleSave}/>
            <input placeholder="Enter new name" class="bg-[rgb(70,70,70)] p-3 rounded-lg" bind:value={newRotation} />
            <Button text="Add" onClick={handleAddNew} />
        </div>
        <Button onClick={() => goto("/")} text="Return to landing" />
        <Button text="Import Rotation" onClick={handleImport}/>
        <Button text="Export Rotation" onClick={handleExport}/>
    </div>
    <div class="w-[30%] ">
        <DndAbilitySelection abilityMap={abilities}/>
    </div>
</div>

<style>
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
</style>