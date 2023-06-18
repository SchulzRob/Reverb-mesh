<script>
	export let filters;

	import GridSelector from './GridSelector.svelte';
	import { filterManager } from '$lib/stores/stores.js';

	const filterToItem = filter => {
		return {
			label: filter.id,
			onSelect: evt => {
				if (filter.makeFilter) {
					$filterManager.addFilter(filter.id, filter);
					filterManager.set($filterManager); // Reactivity
				}
			},
			onDeselect: () => {
				if (filter.makeFilter) {
					$filterManager.removeFilter(filter.id);
					filterManager.set($filterManager); // Reactivity
				}
			},
			selected: false,
			options: filter.options
		};
	};

	let items = filters.map(filterToItem);
	$: {
		for (const item of items) {
			item.selected = $filterManager.filterIsApplied(item.label);
		}
		items = items; // Reactivity
	}
</script>

<div>
	<h2>Filters</h2>

	<GridSelector {items} />
</div>

<style lang="scss">
	@import "variables";

	div {
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: start;

		width: 30%;
		height: max-content;

		border: $border;
		border-radius: $border-radius;
	}
</style>
