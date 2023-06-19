<script>
	export let options;
	export let title = '';

	import NumberOption from './NumberOption.svelte';
</script>

<div class="container">
	<span>Options {title}</span>
	<table cellspacing="0" cellpadding="0">
		<!--<tr>
			<th>name</th>
			<th>min</th>
			<th>val</th>
			<th>max</th>
		</tr>-->
		{#if options == undefined}
			<span>No options</span>
		{:else}
			{#each options as option}
				<NumberOption label={option.name} {option} />
			{/each}
		{/if}
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
		width: 100%;

		span {
			display: block;
			color: white;
			padding: 2px;
			margin-bottom: 4px;
		}
	}
</style>
