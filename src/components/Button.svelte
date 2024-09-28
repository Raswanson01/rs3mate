<script>
    export let text;
    export let onClick;
    export let color = "blue";

    const bgColor = color === "red" ? "bg-red-500" : "bg-blue-500";
    const hoverColor = color === "red" ? "hover:bg-red-600" : "hover:bg-blue-600";
    const activeColor = color === "red" ? "active:bg-red-700" : "active:bg-blue-700";
</script>

<button class={`rounded-lg shadow-md text-white px-4 py-2 m-5 cursor-pointer transition-colors duration-150 ${bgColor} ${hoverColor} ${activeColor}`}
    on:click={() => onClick()}>
    <h3>{text}</h3>
</button>