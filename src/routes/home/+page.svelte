<script lang="ts">
	import { goto } from "$app/navigation";
  	import { activeAbility, defaultAbility, selectedIndex } from "../../barStore";
  	import ActionBar from "../../components/ActionBar.svelte";
	import Button from "../../components/Button.svelte";
    
	const bar1 = [
		{ keybind: "Q", imagePath: "Anticipation.png", abilityName: "Anticipation" },
		null,
		null,
		{ keybind: null, imagePath: "Assault.png", abilityName: "Assault" }
	]
	console.log("Sel abil: ", $activeAbility);
</script>

<div class="container">
	<div class="vert">
		<ActionBar barNumber={1} abilities={[]} />
		<ActionBar barNumber={2} abilities={bar1} />
		<ActionBar barNumber={3} abilities={[]} />
		<ActionBar barNumber={4} abilities={[]} />
		<Button onClick={() => goto("/")} text="Return to landing" />
	</div>
	<div class="column">
		<strong>Active Ability</strong>
		<h1>Ability: { $activeAbility.abilityName }</h1>
		<h1>Keybind: { $activeAbility.keybind ? $activeAbility.keybind : "None" }</h1>
		<h1>Slot: {$selectedIndex !== null ? $selectedIndex + 1 : "None"}</h1>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
	}
	.column {
		margin-top: 8px;
		margin-left: 10px;
	}
</style>