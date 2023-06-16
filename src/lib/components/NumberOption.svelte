<script>
	export let option;
	export let label;

	const MAX_NUM = 3.4028234663852886e+38;

	const prettifyValue = value => {
		if (value == MAX_NUM || value == -MAX_NUM) {
			return 'Inf.';	
		}

		return value;
	};
</script>

<div class="container">
	<label>{label}</label>
	<span class="left">{prettifyValue(option.minValue)}</span>
	<div>
	<input type="number" min={option.minValue} max={option.maxValue} step={option.step} bind:value={option.value}>
	</div>
	<span class="right">{prettifyValue(option.maxValue)}</span>
</div>

<style lang="scss">
	@use "sass:color";

	$background-color: #808080;
	$background-color-light: lighten($background-color, 20%);
	$border-color: color.scale($background-color, $lightness: -50%);
	$font-size: 1rem;
	$border-radius: 0.5rem;

	div.container {
		width: max-content;
		display: flex;
		flex-flow: row;
		align-items: center;
		border: 2px solid $border-color;
		border-radius: $border-radius;
		overflow: hidden;
		background-color: $border-color; 
		
		label {
			padding: 2px 6px 2px 4px;
			background-color: $border-color;
			color: white;
		}

		span {
			background-color: $background-color; 
			padding: 2px 4px;
			box-sizing: border-box;
			font-size: $font-size;

			&.left {
				//padding-right: 0;
				//border-right: 4px groove $background-color;
				border-top-left-radius: $border-radius;
				border-bottom-left-radius: $border-radius;
			}

			&.right {
				//padding-left: 0;
				//border-left: 4px ridge $background-color;
			}
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
		}
	}
</style>
