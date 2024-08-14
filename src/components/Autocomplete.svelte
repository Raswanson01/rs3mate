<script lang="ts">
    export let options;
    export let labelField;
</script>

<div>
    {#each options as option}
        <div>{option[labelField]}</div>
    {/each}
</div>