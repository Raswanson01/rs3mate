<script lang="ts">
  import { goto } from "$app/navigation";
  import { appLocalDataDir, join } from "$lib/tauri-wrapper";
  import Button from "../../components/Button.svelte";
  import type { Rotation } from "../../models/abilities";
  import { rotationItems } from "../rotationBuilder/rotationStore";
  import { writeTextFile } from "@tauri-apps/api/fs";
  import { WebviewWindow } from "@tauri-apps/api/window";

  export let data: any;
  let rotations = data.rotations;
  let barConfigs = data.barConfigs;
  let selectedRotation: Rotation;
  let selectedBarConfig: any;


  async function createTrackerWindow() {

    const localPath = await appLocalDataDir();
    const outFile = await join(localPath, "trackerConfig.json");
    const outObject = {
        rotation: selectedRotation,
        barConfig: selectedBarConfig
    }
    await writeTextFile(outFile, JSON.stringify(outObject));

    const newWindow = new WebviewWindow('Tracker', {
      url: '/rotationTracker',
      alwaysOnTop: true,
      title: "Tracker",
      width: 1000,
      height: 300,
    });
    newWindow.once('tauri://created', () => console.log("New window created"));
  }
</script>


<div class="flex flex-col">
    <p class="m-5">Select Bar config</p>
    <select class="p-3 w-[50%] bg-[rgb(70,70,70)] rounded-lg mx-5" 
        placeholder="Select Bar" 
        bind:value={selectedBarConfig}
    >
        {#each barConfigs as barConfig}
            <option value={barConfig}>{barConfig.name}</option>
        {/each}
    </select>
    <p class="m-5">Select Rotation to feed</p>
    <select class="p-3 w-[50%] bg-[rgb(70,70,70)] rounded-lg mx-5" 
        placeholder="Select rotation" 
        bind:value={selectedRotation}
        on:change={() => $rotationItems = selectedRotation.abilities}
    >
        {#each rotations as rotation}
            <option value={rotation}>{rotation.name}</option>
        {/each}
    </select>
    <div class="w-[50%] flex flex-row">
        <Button onClick={() => goto("/")} text="Return to landing"/>
        <Button onClick={() => createTrackerWindow()} text="Start Tracker"/>
    </div>
</div>