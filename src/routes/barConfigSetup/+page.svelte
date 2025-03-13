<script lang="ts">
  import Database from "@tauri-apps/plugin-sql";
  import Button from "../../components/Button.svelte";
  import type { BarConfig } from "../../data/abilities";
  import Plus from '~icons/mdi/plus';
  import TrashCan from '~icons/mdi/trash-can-outline';
  import { createNewBarConfig, deleteBarConfig, fetchBarConfigs } from "../../daos/barConfigDao";

    export let data: any;
    export let barConfigs: BarConfig[] = data.barConfigs;

    const createBarConfig = async () => {
        await createNewBarConfig();
        barConfigs = await fetchBarConfigs();
    }

    const handleDeleteConfig = async (barConfigId: number) => {
        await deleteBarConfig(barConfigId);
        barConfigs = await fetchBarConfigs();
    }
</script>

<div class="p-4 flex flex-col items-center min-h-screen">
    <div class="flex flex-row items-center">
        <h5>Bar Configs</h5>
    </div>


    {#if barConfigs.length === 0}
    <div class="flex flex-col justify-center items-center mt-5">
        <h5>No bar configs. Create a new one to get started.</h5>

    </div>

    {/if}
    <button class="bg-blue-600 rounded-md ml-2 mt-2 flex flex-row items-center p-1" on:click={createBarConfig}>
        <h1>Create New</h1>
        <Plus class="size-8"/>
    </button>
    {#each barConfigs as barConfig}
    <div class="flex flex-row items-center">
        <button on:click={() => handleDeleteConfig(barConfig.id)} class="flex items-center justify-center p-1">
            <TrashCan class="size-5 ml-2" />
        </button>
        <h5>{barConfig.name}</h5>

    </div>

    {/each}
</div>

