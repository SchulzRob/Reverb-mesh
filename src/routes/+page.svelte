<script>
	import '$styles/styles.scss';
	import Header from '$lib/components/Header.svelte';
	import Button from '$lib/components/Button.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import FilterSelector from '$lib/components/FilterSelector.svelte';
	import Equalizer from '$lib/components/Equalizer.svelte';
	import IconLink from '$lib/components/IconLink.svelte';
	import github_icon from '$static/images/github.svg';

	import filters from '$lib/filters.js';

	const title = 'Reverb-mesh';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="app">
	<Header {title}/>

	<main>
		<FilterSelector {filters} />

		<div class="right-box">
			<AudioPlayer />
			<Equalizer />
		</div>
	</main>

	<footer>
		<IconLink icon={github_icon} href="https://github.com/SchulzRob/Reverb-mesh" label="GitHub" />
	</footer>
</div>

<style lang="scss">
	@import "variables";

	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: $primary-background-color;
	}

	main {
		display: flex;
		flex: 1;
		flex-direction: row;
		padding: 1rem;
		width: 80%;
		margin: 0 auto;
		box-sizing: border-box;
		border: 1px solid black;

		div {
			margin-left: 1rem;
			display: flex;
			flex-flow: column;
			flex-grow: 2;
		}
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem;
	}
</style>
