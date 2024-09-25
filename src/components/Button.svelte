<script>
    export let text;
    export let onClick;
    export let color = "blue";
</script>

<button class="
    rounded-lg
    shadow-md 
    bg-{color}-500 
    text-white 
    px-4 
    py-2
    m-5
    cursor-pointer
    hover:bg-blue-600
    active:bg-blue-700 
    transition-colors 
    duration-150"
    on:click={() => onClick()}
>
    <h3>{text}</h3>
</button>