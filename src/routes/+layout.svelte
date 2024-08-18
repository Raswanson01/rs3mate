<script>
  import { goto } from "$app/navigation";
  import "../app.css";
</script>

<!-- <footer class="footer">
    <button class="barButton" on:click={() => goto("/barSetup")}>
        <h7>Bar Setup</h7>
    </button>
</footer> -->

<style>
    .barButton {
        border-radius: 5px;
        border-color: gray;
        border-width: 2px;
        padding: 8px;
    }
    .footer {
        position: fixed;
        bottom: 0;
        padding: 10px;
        width: 100%;
        background-color: rgb(255, 72, 0);
        z-index: 999;
    }
</style>
<slot />