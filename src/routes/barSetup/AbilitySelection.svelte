<script lang="ts">
    import { flip } from 'svelte/animate';
    import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
    import type { BarAbility } from '../../models/abilities';
    import { dragging } from '../../barStore';
    export let items: BarAbility[];

    function handleDragStart(item: BarAbility) {
        console.log("Drag start"); 
        $dragging = item
    }

    //If I ever go back to dnd-action, I need to handle updating the list on BOTH ends!
</script>

<section class="container">
    {#each items as item(item.id)}
        <button  on:dragstart={() => handleDragStart(item)}>
            <img class="item" 
            src="Images/{item.img}"
            alt="The {item.name} ability"
        />
        </button>
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