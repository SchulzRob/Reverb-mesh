<script>
	export let filters;

	import GridSelector from './GridSelector.svelte';
	import { filterManager } from '$lib/stores/stores.js';

	const filterToItem = filter => {
		const { label, makeFilter } = filter;

		return {
			label: label,
			onSelect: evt => {
				if (makeFilter != undefined) {
					$filterManager.addFilter(label, makeFilter);
					filterManager.set($filterManager); // Reactivity
				}
			},
			onDeselect: () => {
				if (makeFilter != undefined) {	
					$filterManager.removeFilter(label);
					filterManager.set($filterManager); // Reactivity
				}
			},
			selected: false
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
	div {
		border: 1px solid black;
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: start;

		width: 30%;
		height: max-content;
	}
</style>
