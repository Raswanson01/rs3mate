<script lang="ts">
    import type { defaultAbility } from "../../barStore";
    import type { BarAbility } from "../../models/abilities";
    import { rotationItems } from "../rotationBuilder/rotationStore";

    console.log("Rotation items: ", $rotationItems)
    let index = 0;
    $: feederQueue = $rotationItems.slice(index, 10);

    let currentQueue: BarAbility[] = Array.from({ length: 14 }, () => ({ ...$defaultAbility }))

</script>

<div class="bg-slate-600">
    <div class="flex flex-row">
        {#each feederQueue as item}
            <img class="" src={item.img} alt="The {item.name} ability"/>
        {/each}
        
    </div>
    <div class="flex flex-row">
        {#each currentQueue as item}
            <img class="" src={item.img} alt="The {item.name} ability"/>
        {/each}
    </div>
</div>
