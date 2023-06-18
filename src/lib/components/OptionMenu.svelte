<script>
	export let options;

	import NumberOption from './NumberOption.svelte';

	let visible = false;
</script>

<div class="container">
	<div>
		<span>Options</span>
		<button on:click={() => visible = !visible}>x</button>
	</div>
	<table style:display={visible ? 'table' : 'none'} cellspacing="0" cellpadding="0">
		<!--<tr>
			<th>name</th>
			<th>min</th>
			<th>val</th>
			<th>max</th>
		</tr>-->
		{#each options as option}
			<NumberOption label={option.name} {option} />
		{/each}
	</table>
</div>

<style lang="scss">
	div.container {
		@import "variables";

		padding: 0;
		border: 2px solid $border-color;
		border-radius: 0.5rem;
		overflow: hidden;
		background-color: $border-color;

		div {
			display: flex;
			justify-content: space-between;

			span {
				color: white;
				padding: 2px;
			}
		}
	}
</style>
