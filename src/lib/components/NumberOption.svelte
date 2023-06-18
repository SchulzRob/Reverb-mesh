<script>
	export let option;
	export let label;

	import { MAX_NUM } from '$lib/audio_utils.js';

	const prettifyValue = value => {
		if (value == MAX_NUM) {
			return 'Inf.';	
		} else if (value == -MAX_NUM) {
			return '-Inf.';	
		}

		return value;
	};
</script>

<tr class="container">
	<td>
		<label>{label}</label>
	</td>
	<td class="field-bg">
		<span>{prettifyValue(option.minValue)}</span>
	</td>
	<td>
		<div>
			<input type="number" min={option.minValue} max={option.maxValue} step={option.step} bind:value={option.value}>
		</div>
	</td>
	<td class="field-bg">
		<span>{prettifyValue(option.maxValue)}</span>
	</td>
</tr>

<style lang="scss">
	@use "sass:color";
	@import "variables";

	$font-size: 1rem;

	tr.container {
		border: 2px solid $border-color;
		overflow: hidden;
		background-color: $border-color; 
		
		label {
			padding: 2px 6px 2px 4px;
			background-color: $border-color;
			color: white;
		}

		td {
			&.field-bg {
				background-color: $background-color;
			}

			span {
				background-color: $background-color; 
				padding: 2px 4px;
				font-size: $font-size;
			}

			div {
				background-color: $background-color-light;
				height: 100%;

				input[type=number] {
					width: 50px;
					background-color: $background-color-light;
					border: none;
					font-size: $font-size;
				}

				padding-bottom: 1px;
			}
		}
	}
</style>
