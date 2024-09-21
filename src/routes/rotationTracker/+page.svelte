<script lang="ts">
    import type { BarAbility } from "../../models/abilities";
  import Button from "../../components/Button.svelte";
  import {  readTextFile } from "@tauri-apps/api/fs";
  import { shiftedKeyMap } from "../../barStore";
  import { appLocalDataDir, join } from "../../lib/tauri-wrapper";

    console.log("Shifted key map: ", $shiftedKeyMap);

    //export let data;
    //console.log("Data: ", data);
    let index = 0;

    let fullRotation: any[];
    //data.barConfig;
    let config: { bars: { bar1: any[]; bar2: any[]; bar3: any[]; bar4: any[]; }; };

    let lastAbility: BarAbility | null = null;
    let configMap: Map<string, BarAbility>;

    let keybind: string[] = [];
    let hasModifier = false;
    let feederQueue: any[] = [];
    let currentQueue: BarAbility[] = [];

    let started = false;
    function handleKeydown(event: any) {
        const key = event.key.toUpperCase();
        if (!['ALT', 'CONTROL', 'SHIFT'].includes(key)) {
            addKey(key);
            return;
        }

        console.log("Included mod key")
        let keyToUse;
        switch(key) 
        {
            case "CONTROL":
                keyToUse = "CTL";
                break;
            case "SHIFT":
                keyToUse = "SFT";
                break;
            default:
                keyToUse = key;
                break;
        }
        console.log("Key to use: ", keyToUse);
        if (!hasModifier && keybind.length === 0) {
            keybind.push(keyToUse);
            hasModifier = true;
            return;
        }
    }

    function addKey(key: string) {
        keybind.push(key);
        const shouldGetShiftedKey = keybind[0] === "SFT" && keybind.length === 2;
        if (shouldGetShiftedKey) {
            console.log("was shiftyed key")
            keybind[1] = $shiftedKeyMap.get(key)!;
        }
    
        const joinedKeybind = keybind.join("+");
        const pressedAbility = configMap.get(joinedKeybind);
        if (!pressedAbility) {
            keybind = [];
            return;
        }

        console.log("Pressed ability: ", pressedAbility);
        console.log("Last ability: ", lastAbility);

        if (lastAbility !== pressedAbility || lastAbility.name === "Necromancy Basic Attack") {
            pressedAbility.id = pressedAbility.id + new Date().getMilliseconds();
            modifyQueues(pressedAbility);
            hasModifier = false;
        }
        keybind = [];

    }

    function modifyQueues(pressedAbility: BarAbility) {
        if (currentQueue.length > 10) {
            currentQueue.pop();
            currentQueue = [...currentQueue];
        }
        if (feederQueue.length > 11) {
            feederQueue.pop();
            feederQueue = [...feederQueue];
        }
        
        const newQueue = [...currentQueue];
        newQueue.unshift(pressedAbility);
        currentQueue = newQueue;
        lastAbility = pressedAbility;
        index = index + 1;
        
        if (fullRotation[index]) {
            feederQueue.unshift(fullRotation[index]);
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

