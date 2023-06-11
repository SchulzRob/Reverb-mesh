<script>
	export let label;
	export let icon = undefined;
	export let style = '';
	export let state = '';

	import Spinner from './Spinner.svelte';
</script>

<button on:click class:disabled={state === 'disabled' || state === 'loading'} {style}>
	{#if state === 'loading'}
		<span class="spinner">
			<Spinner />
		</span>
	{:else if icon != undefined}
		<img src={icon} alt={label}>
	{/if}

	{#if label != undefined}
		<span>{label}</span>
	{/if}
</button>

<style lang="scss">
	@import 'variables';

	button {
		$button-font-size: 1rem;
		color: $button-color;
		background-color: $button-background-color;
		border-radius: $button-font-size * 2;
		padding: 0.5rem 1rem;
		font-size: $button-font-size;
		border: none;
		box-shadow: 2px 2px 3px $button-shadow-color;

		// Align content
		display: flex;
		align-items: center;

		&.disabled:hover {
			cursor: initial;
			background-color: $button-background-color;
		}

		&:hover {
			cursor: pointer;
			background-color: lighten($button-background-color, 3%);
		}

		img {
			width: $button-icon-size;
			height: $button-icon-size;
		}

		img, span.spinner {
			margin-right: $button-icon-label-gap;
		}
	}
</style>
