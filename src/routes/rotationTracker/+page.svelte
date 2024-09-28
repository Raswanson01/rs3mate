<script lang="ts">
    import type { BarAbility } from "../../models/abilities";
    import Button from "../../components/Button.svelte";
    import {  readTextFile } from "@tauri-apps/api/fs";
    import { shiftedKeyMap } from "../../barStore";
    import { appLocalDataDir, join } from "../../lib/tauri-wrapper";
    import { scale } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { getCurrent } from "@tauri-apps/api/window";
    import { PhysicalPosition } from '@tauri-apps/api/window';

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
    let nextAbility: BarAbility;

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
        if (feederQueue.length > 10) {
            feederQueue.pop();
            feederQueue = [...feederQueue];
        }
        
        const newQueue = [...currentQueue];
        const newId = `${pressedAbility.id}_copy_${Math.round(Math.random()*100000)}`;
        const newAbility: BarAbility = { ...pressedAbility, id: newId }
        
        newQueue.unshift(newAbility);
        currentQueue = newQueue;
        lastAbility = pressedAbility;
        index = index + 1;
        
        nextAbility = fullRotation[index];

        if (nextAbility) {
            nextAbility.id = nextAbility.id + (Math.random() * 10000) + new Date().getMilliseconds();
            feederQueue.unshift(fullRotation[index - 1]);
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
        nextAbility = fullRotation[0];
    }
    
    const transition = {
        x: 50,
        duration: 500,
    }

    async function closeWindow() {
        const currentWindow = getCurrent();
        currentWindow.close();
    }

    let dragging = false;
    let startX = 0;
    let startY = 0;

    async function onMouseDowne(event: MouseEvent) {
        const currentWindow = getCurrent();
        dragging = true;
        const { x, y } = await currentWindow.outerPosition(); // Get current window position
        startX = event.screenX - x;
        startY = event.screenY - y;
    }

    async function onMouseMove(event: MouseEvent) {
        const currentWindow = getCurrent();
        if (dragging) {
            const newX = event.screenX - startX;
            const newY = event.screenY - startY;
            const newPosition: PhysicalPosition = new PhysicalPosition(newX, newY)
            await currentWindow.setPosition(newPosition); // Set new position
        }
    }

    function onMouseUp() {
        dragging = false;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  
</script>

<svelte:window on:keydown={handleKeydown}/>


{#if started}

<div class="bg-slate-600 w-screen h-screen flex items-center flex-row">
    <div>
        <img
            class="mx-5 border-solid border-2 border-yellow-500 size-14"
            transition:scale={transition} 
            src="Images/{nextAbility?.img}"
            alt="The {nextAbility?.name} ability"
        />
    </div>

    <div class="flex-col">
        <div class="flex flex-row">
            {#each feederQueue as item (item.id)}
                <img 
                    transition:scale={transition}
                    animate:flip
                    class="m-1 size-12" 
                    src="Images/{item.img}"
                    alt="The {item.name} ability"
                />
            {/each}
            
        </div>
        <div class="flex flex-row">
            {#each currentQueue as item (item.id)}
                <img 
                    transition:scale={transition}
                    animate:flip
                    class="m-1 size-12"
                    src="Images/{item.img}" alt="The {item.name} ability"/>
            {/each}
        </div>

    </div>
    <div class="flex flex-col ml-auto">
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <h1 on:mousedown={(event) => onMouseDowne(event)} class="drag-zone size-20">X+</h1>
        <button class="w-15
         bg-red-600 p-2  mr-10 text-white hover:bg-red-700 active:red-800 
         transition-colors rounded-lg shadow-mm duration-150" 
         on:click={closeWindow}
         >Close</button>
    </div>
    

</div>
{:else}
    <Button text="Start" onClick={loadData}/>
{/if}

<style>
    .drag-zone {
        -webkit-app-region: drag;
        width: 50%;  /* Full width zone */
        height: 30px; /* Example height */
        background-color: #333; /* Just for visibility */
        cursor: move; /* Show drag cursor */
    }
    
</style>

