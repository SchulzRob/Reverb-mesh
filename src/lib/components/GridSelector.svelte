<script>
	export let items;

	import GridTile from './GridTile.svelte';
	import OptionMenu from './OptionMenu.svelte';
</script>

<div class="container">
	{#each items as { label, icon, onEnable, onDisable, onClick, enabled, selected }}
		<GridTile {label} {icon} bind:checked={enabled} on:enable={onEnable} on:disable={onDisable} on:click={onClick} bind:selected />
	{/each}
</div>

<style lang="scss">
	div.container {
		width: 100%;
		display: grid;
		box-sizing: border-box;
		padding: 0.5rem;
		grid-template-columns: repeat(auto-fit, minmax(110px, max-content));
		justify-content: center;
	}
</style>
