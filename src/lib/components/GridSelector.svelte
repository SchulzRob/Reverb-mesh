<script>
	export let items;

	import GridTile from './GridTile.svelte';
</script>

<div>
	{#each items as { label, onSelect, onDeselect, selected }}
		<GridTile {label} bind:selected on:select={onSelect} on:deselect={onDeselect}/>
	{/each}
</div>

<style lang="scss">
	div {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		padding: 0.5rem;
	}
</style>
