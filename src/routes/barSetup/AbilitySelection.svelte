<script lang="ts">
    import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
    import type { BarAbility } from '../../models/abilities';

    export let items: BarAbility[];
    const flipDurationMs = 300;

    function handleConsider(e: any) {
        const {trigger, id} = e.detail.info;
        console.log("Considering from AbilitySelection", e.detail)
        if (trigger === TRIGGERS.DRAG_STARTED) {
            console.warn(`copying ${id}`);
            let idx = items.findIndex(item => item.id === id);
            const newId = `${id}_copy_${Math.round(Math.random()*100000)}`;
						// the line below was added in order to be compatible with version svelte-dnd-action 0.7.4 and above 
					  e.detail.items = e.detail.items.filter((item: any) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
            e.detail.items.splice(idx, 0, {...items[idx], id: newId});
            items = e.detail.items;
        }
        else {
            items = [...items]
        }
    }

    function handleFinalize(e: any) {
        const { trigger, id } = e.detail.info;
        console.log("Finalizing from AbilitySelection", e.detail)
        items = [...items]
    }

</script>

<section class="container" use:dndzone={{items, flipDurationMs}}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
>
    {#each items as item(item.id)}
        <img class="item" src="Images/{item.img}"alt="The {item.name} ability"/>
    {/each}
</section>

<style>
    .item {
        border-radius: 2px;
        border-width: 1px;
        margin-top: 15px;
        margin-right: 16px;
        padding: 2px;
        width: 50px;
        height: 50px;
    }
    .container {
        flex-wrap: wrap;
        display: flex;
        flex-direction: row;
    }
</style>