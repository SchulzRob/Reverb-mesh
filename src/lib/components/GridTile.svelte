<script>
	export let label;
	export let checked;
	export let selected = false;
	export let icon = undefined;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	
	const onInput = evt => {
		if (checked) {
			console.debug(`Unchecked tile "${label}"`);
			dispatch('disable');
		} else {
			console.debug(`Checked tile "${label}"`);
			dispatch('enable');
		}
	};

	const onClick = evt => {
		// Prevent checkbox check/uncheck from calling the onClick listener
		if (evt.target.tagName != 'INPUT') {
			dispatch('click');
		}
	};
</script>

<div class="gap">
	<div class="container" class:selected on:click={onClick}>
		{#if icon != undefined}
			<img src={icon} alt={label}>
		{/if}
		<div class="label">
			<span>{label}</span>
			<input type="checkbox" bind:checked={checked} on:input={onInput}>
		</div>
	</div>
</div>

<style lang="scss">
	@import "variables";

	$size: 94px;
	$icon-size: 64px;

	div.gap {
		padding: 0.5rem;
		box-sizing: border-box;

		div.container {
			border: $border;
			border-radius: $border-radius;
			background-color: $background-color-light;

			box-sizing: border-box;
			width: $size;
			height: $size;

			display: flex;
			flex-flow: column;
			align-items: center;
			justify-content: center;

			&:hover {
				cursor: pointer;
			}

			&.selected {
				background-color: $background-color;
			}

			img {
				width: $icon-size;
				height: $icon-size;
			}

			div.label {
				display: flex;
				flex-flow: row;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 2px;
			}
		}
	}
</style>
