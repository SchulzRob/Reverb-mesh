<script>
	export let text;

	import Button from './Button.svelte';

	let container;
</script>

<div class="background" bind:this={container}>
	<div>
		<span>{text}</span>
		<Button label="Ok" on:click={() => container.remove()} />
	</div>
</div>

<style lang="scss">
	@import "variables";

	div.background {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 999;
		background-color: #00000055;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;

		div {
			display: flex;
			flex-flow: column;
			justify-content: center;
			align-items: center;
			min-width: 15rem;
			border: 1px solid $primary-blue;
			padding: 0.75rem;
			background-color: white;
			box-shadow: 1px 1px 5px black;

			span {
				margin-bottom: 1rem;
			}
		}
	}
</style>
