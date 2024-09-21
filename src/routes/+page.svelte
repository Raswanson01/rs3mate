<script lang="ts">
  import Button from "../components/Button.svelte";
  import { goto } from "$app/navigation";
</script>

<div class="container">
  <h1>Welcome to Rs3Mate!</h1>

  <Button onClick={() => goto("/barSetup")} text="Bar Setup"/>
  <Button onClick={() => goto("/rotationBuilder")} text="Rotation Builder"/>
  <Button onClick={() => goto("/trackerSetup")} text="Tracker Setup"/>

</div>

<style>

  :root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    color: #0f0f0f;
    background-color: #f6f6f6;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  .container {
    margin: 0;
    padding-top: 10vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  h1 {
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      color: #f6f6f6;
      background-color: #2f2f2f;
    }

  }
</style>
