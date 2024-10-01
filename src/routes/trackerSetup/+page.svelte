<script lang="ts">
  import { goto } from "$app/navigation";
  import { appLocalDataDir, join } from "$lib/tauri-wrapper";
  import Button from "../../components/Button.svelte";
  import type { Rotation } from "../../models/abilities";
  import { rotationItems } from "../rotationBuilder/rotationStore";
  import { exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
  import { WebviewWindow } from "@tauri-apps/api/window";

  export let data: any;
  let rotations = data.rotations;
  let barConfigs = data.barConfigs;
  let selectedRotation: Rotation;
  let selectedBarConfig: any;

  let queueSize: number = 10;
  let animationEnabled: boolean = true;

  async function createTrackerWindow() {

    const localPath = await appLocalDataDir();
    const outFile = await join(localPath, "trackerConfig.json");
    let position = { x: 0, y: 0 };
    if (await exists(outFile)) {
        const data = await readTextFile(outFile);
        const parsedData = JSON.parse(data);
        const prevPosition = parsedData.position;
        position = {
            x: prevPosition ? prevPosition.x : 0,
            y: prevPosition ? prevPosition.y : 0
        }
    }

    let outObject = {
        rotation: selectedRotation,
        barConfig: selectedBarConfig,
        position: position,
        queueSize: queueSize,
        animationEnabled: animationEnabled
    };
    
    await writeTextFile(outFile, JSON.stringify(outObject));

    const newWindow = new WebviewWindow('Tracker', {
      url: '/rotationTracker',
      alwaysOnTop: true,
      title: "Tracker",
      decorations: false,
      width: 100 + 75 * queueSize,
      height: 150,
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
    <label>
        <input class="mx-5 mt-5" type="checkbox" bind:checked={animationEnabled}/>
            Animation enabled (Doesn't actually do anything atm)
        </label>
    <label class="mx-5 mt-5">
        Queue size: <input class="p-1 bg-blue-300 text-black" type="number" bind:value={queueSize} min=0 max=15 />
        <input type="range" bind:value={queueSize} min=0 max=15>
    </label>
    <div class="w-[50%] flex flex-row">
        <Button onClick={() => goto("/")} text="Return to landing"/>
        <Button onClick={() => createTrackerWindow()} text="Start Tracker"/>
    </div>
</div>