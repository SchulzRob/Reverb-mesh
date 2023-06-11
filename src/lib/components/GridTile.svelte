<script>
	export let label;
	export let selected;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	
	const onClick = evt => {
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
	<div class:selected on:click={onClick}>
		{label}
	</div>
</div>

<style lang="scss">
	div.gap {
		padding: 0.5rem;
		box-sizing: border-box;

		div {
			border: 1px solid black;
			box-sizing: border-box;
			width: 64px;
			height: 64px;
			cursor: pointer;

			&.selected {
				background-color: #00000044;
			}
		}
	}
</style>
