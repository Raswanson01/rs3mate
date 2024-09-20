<script lang="ts">
  import { listen, type UnlistenFn } from "@tauri-apps/api/event";
    import type { BarAbility } from "../../models/abilities";
  import { onMount } from "svelte";
  import Button from "../../components/Button.svelte";
  import { appLocalDataDir, join } from "@tauri-apps/api/path";
  import { exists, readTextFile } from "@tauri-apps/api/fs";


    //export let data;
    //console.log("Data: ", data);
    let index = 0;

    let fullRotation: any[];
    //data.barConfig;
    let config: { bars: { bar1: any[]; bar2: any[]; bar3: any[]; bar4: any[]; }; };

    let lastAbility: BarAbility | null = null;
    let configMap: Map<string, BarAbility>;
    let feederQueue: any[] = [];
    let currentQueue: BarAbility[] = [];

    let started = false;
    function handleKeydown(event: any) {
        const pressedAbility = configMap.get(event.key);
        console.log("Pressed abil: ", pressedAbility)
        if (!pressedAbility) {
            return;
        }
        if (currentQueue.length > 10) {
            currentQueue.shift();
            currentQueue = [...currentQueue];
        }
        if (feederQueue.length > 11) {
            feederQueue.shift();
            feederQueue = [...feederQueue];
        }
        //TODO update to use same massaging logic to match shift, control, etc
        if (lastAbility !== pressedAbility || lastAbility?.name === "Necromany Basic Attack") {
            const newQueue = [...currentQueue];
            newQueue.push(pressedAbility);
            currentQueue = newQueue;
            lastAbility = pressedAbility;
            index = index + 1;
            
        }
        if (fullRotation[index]) {
            feederQueue.push(fullRotation[index]);
            feederQueue = [...feederQueue];
        }
    }

    function createConfigMap() {
        const map = new Map();
        config.bars.bar1.map(ability => {
            map.set(ability.keybind, ability);
        })
        config.bars.bar2.map(ability => {
            map.set(ability.keybind, ability);
        })
        config.bars.bar3.map(ability => {
            map.set(ability.keybind, ability);
        })
        config.bars.bar4.map(ability => {
            map.set(ability.keybind, ability);
        })
        return map;
    }

    async function loadData() {
        const localPath = await appLocalDataDir();
        const trackerConfigPath = await join(localPath, "trackerConfig.json");
        const trackerData = await readTextFile(trackerConfigPath);
        const { barConfig, rotation } = JSON.parse(trackerData);
        config = barConfig;
        fullRotation = rotation.abilities;
        configMap = createConfigMap();
        started = true;

        console.log("Full rot: ", fullRotation);
        console.log("Config: ", config)
        feederQueue = [fullRotation[0]];
    }
    

</script>

<svelte:window on:keydown={handleKeydown}/>


{#if started}
<div class="bg-slate-600">
    <div class="flex flex-row">
        {#each feederQueue as item}
            <img class="m-1" src="Images/{item.img}" alt="The {item.name} ability"/>
        {/each}
        
    </div>
    <div class="flex flex-row">
        {#each currentQueue as item}
            <img class="m-1" src="Images/{item.img}" alt="The {item.name} ability"/>
        {/each}
    </div>
</div>
{:else}
    <Button text="Start" onClick={loadData}/>
{/if}

