<script>
	export let label = 'Upload file';
	export let accept = '*';
	export let style = '';

	import Button from './Button.svelte';
	import icon from '$static/images/upload.svg'; 
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let fileInput;
</script>

<div {style}>
	<Button {icon} {label} on:click={() => fileInput.click()}/>
	<input bind:this={fileInput} type="file" {accept} on:input={evt => dispatch('upload', evt.srcElement.files[0])} >
</div>

<style lang="scss">
	div {
		flex: 0 0 auto;

		input[type=file] {
			display: none;
		}
	}
</style>
