<script>
	export let items;

	import GridTile from './GridTile.svelte';
	import OptionMenu from './OptionMenu.svelte';

	// TODO bind: in each for selected grid tile
	// TODO rename onselect, ondeselect to onenable ondisable
</script>

<div class="container">
	{#each items as { label, icon, onEnable, onDisable, onClick, enabled, selected }}
		<GridTile {label} {icon} bind:checked={enabled} on:enable={onEnable} on:disable={onDisable} on:click={onClick} bind:selected />
	{/each}
</div>

<style lang="scss">
	div.container {
		width: 100%;
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		padding: 0.5rem;
		align-items: flex-start;
	}
</style>
