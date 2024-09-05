<script lang="ts">
    import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
    import type { BarAbility } from '../../models/abilities';
  import { flip } from 'svelte/animate';

    export let items: BarAbility[];

    function handleConsider(event: DragEvent, item: BarAbility) {
        console.log("Item: ", item);
        event.dataTransfer?.setData("text/plain", JSON.stringify(item));
        console.log("Event: ", event);
    }

</script>

<section class="container" draggable={true}>
    {#each items as item(item.id)}
        <img
            animate:flip
            draggable={true}
            on:dragstart={event => handleConsider(event, item)}
            class="item" src="Images/{item.img}"alt="The {item.name} ability"/>
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