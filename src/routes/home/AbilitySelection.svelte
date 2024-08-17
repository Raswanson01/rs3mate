<script lang="ts">
    import { flip } from 'svelte/animate';
    import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
    import type { BarAbility } from '../../models/abilities';
    export let items: BarAbility[];
    const flipDurationMs = 300;
    let shouldIgnoreDndEvents = false;
    function handleDndConsider(e: any) {
        const {trigger, id} = e.detail.info;
        if (trigger === TRIGGERS.DRAG_STARTED) {
            const idx = items.findIndex(item => item.id === id);
            const newId = `${id}_copy_${Math.round(Math.random()*100000)}`;
						// the line below was added in order to be compatible with version svelte-dnd-action 0.7.4 and above 
					  e.detail.items = e.detail.items.filter((item: any) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
            e.detail.items.splice(idx, 0, {...items[idx], id: newId});
            items = e.detail.items;
            shouldIgnoreDndEvents = true;
        }
        else if (!shouldIgnoreDndEvents) {
            items = e.detail.items;
        }
        else {
            items = [...items];
        }
    }
    function handleDndFinalize(e: any) {
        console.warn(`got finalize ${JSON.stringify(e.detail, null, 2)}`);
        if (!shouldIgnoreDndEvents) {
            items = e.detail.items;
        }
        else {
            items = [...items];
            shouldIgnoreDndEvents = false;
        }
    }
</script>

<h3>Dragula-like Copy on Drag</h3>
<p>Copy cannot be dropped back to the list right away, but can be dragged to back to the original list after it was first dropped somewhere else</p>
<section use:dndzone={{items, flipDurationMs}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
    {#each items as item(item.id)}
        <div animate:flip="{{duration: flipDurationMs}}">
            {item.abilityName}
        </div>
    {/each}
</section>