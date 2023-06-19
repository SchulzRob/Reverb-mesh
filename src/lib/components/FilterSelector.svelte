<script>
	export let filters;

	import GridSelector from './GridSelector.svelte';
	import OptionMenu from './OptionMenu.svelte';
	import { filterManager } from '$lib/stores/stores.js';

	const filterToItem = filter => {
		const item = {
			label: filter.id,
			icon: filter.icon,
			onEnable: evt => {
				if (filter.makeFilter) {
					$filterManager.addFilter(filter.id, filter);
					filterManager.set($filterManager); // Reactivity
				}
			},
			onDisable: () => {
				if (filter.makeFilter) {
					$filterManager.removeFilter(filter.id);
					filterManager.set($filterManager); // Reactivity
				}
			},
			enabled: false,
			options: filter.options,
			onClick: () => {
				lastClicked.selected = false;
				lastClicked = item;
				lastClicked.selected = true;
				items = items; // Reactivity
			},
			selected: false
		};
		return item;
	};

	let items = filters.map(filterToItem);
	let lastClicked = items[0];
	lastClicked.selected = true;

	$: {
		for (const item of items) {
			item.enabled = $filterManager.filterIsApplied(item.label);
		}
		items = items; // Reactivity
	}
</script>

<div>
	<h2>Filters</h2>

	<GridSelector {items} />
	<OptionMenu options={lastClicked.options} title={` of ${lastClicked.label}`} />
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
