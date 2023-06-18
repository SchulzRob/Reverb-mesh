<script>
	export let items;

	import GridTile from './GridTile.svelte';
	import OptionMenu from './OptionMenu.svelte';
</script>

<div class="container">
	{#each items as { label, onSelect, onDeselect, selected, options }}
		{#if options == undefined }
			<GridTile {label} bind:selected on:select={onSelect} on:deselect={onDeselect} />
		{:else}
			<GridTile {label} bind:selected on:select={onSelect} on:deselect={onDeselect}>
				<OptionMenu {options} />
			</GridTile>
		{/if}
	{/each}
</div>

<style lang="scss">
	div.container {
		width: 100%;
		display: flex;
		flex-flow: column;
		flex-wrap: no-wrap;
		padding: 0.5rem;
		align-items: flex-start;
	}
</style>
