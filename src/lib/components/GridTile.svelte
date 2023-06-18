<script>
	export let label;
	export let selected;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	
	const onInput = evt => {
		if (selected) {
			console.debug(`Deselected tile "${label}"`);
			dispatch('deselect');
		} else {
			console.debug(`Selected tile "${label}"`);
			dispatch('select');
		}
	};
</script>

<div class="gap">
	<div class="container" class:selected>
		<div class="label">
			<span>{label}</span>
			<input type="checkbox" bind:checked={selected} on:input={onInput}>
		</div>
		<slot></slot>
	</div>
</div>

<style lang="scss">
	@import "variables";

	div.gap {
		padding: 0.5rem;
		box-sizing: border-box;

		div.container {
			border: $border;
			border-radius: $border-radius;
			background-color: $background-color-light;

			box-sizing: border-box;
			min-width: 64px;
			min-height: 64px;
			padding: 2px;
			
			&.selected {
				background-color: #00000044;
			}

			div.label {
				display: flex;
				flex-flow: row;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 2px;

				button {
					cursor: pointer;
				}
			}
		}
	}
</style>
