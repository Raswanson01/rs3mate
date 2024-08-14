<script lang="ts">
    interface AbilityMap {
        melee: string[];
        ranged: string[];
        magic: string[];
        necromancy: string[]
        defence: string[]
    }

    const abilitiesMap: AbilityMap = {
        melee: [
            "Backhand",
            "Lesser_Havoc",
            "Lesser_Sever",
            "Lesser_Smash",
            "Slice",
            "Slaughter",
            "Overpower",
            "Havoc",
            "Forceful_Backhand"
        ],
        ranged: [
            "Deadshot",
            "Snipe"
        ],
        magic: [
            "Combust",
            "Wild_Magic"
        ],
        necromancy: [
            "Assault"
        ],
        defence: [
            "Resonance",
            "Anticipation"
        ]

    }
    export let selectedCategory: keyof AbilityMap;
</script>

<div class="container">
    {#each abilitiesMap[selectedCategory] as ability}
        <div class="try">
            <img src="ImagesOrigin/{ability}.png" alt="The {ability} ability"/>
        </div>
    {/each}
</div>

<style>
    .try {

		border-style: solid;
		border-radius: 5px;
		border-color: rgb(70, 70, 70);
		border-width: 1px;
		margin-top: 10px;
		width: 50px;
		height: 50px;
		padding: 4px;
	
    }
</style>