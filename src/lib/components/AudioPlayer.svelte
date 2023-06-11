<script>
	import FileUploadButton from './FileUploadButton.svelte';
	import FileDownloadButton from './FileDownloadButton.svelte';
	import InfoBox from './InfoBox.svelte';
	import { onDestroy } from 'svelte';
	import exclamationCircle from '$lib/images/exclamation-circle.svg';
	import infoCircle from '$lib/images/info-circle.svg';
	import { renderAudio } from '$lib/audio_utils.js';
	import { filterManager } from '$lib/stores/stores.js';

//	import { lowpass } from '$lib/filters.js';


	let player;
	let sourceFile;

	const clearSourceURL = () => {
		if (sourceFile != undefined && sourceFile.url != undefined) {
			URL.revokeObjectURL(sourceFile.url);
		}

		sourceFile = undefined;
	};

	let audioCtx, audioSource;
	const onUpload = file => {
		if (file.detail == undefined) {
			console.error('Cannot set audio player source: No file was uploaded!');
			return;
		}

		clearSourceURL();

		// Load source audio
		sourceFile = file.detail;
		sourceFile.url = URL.createObjectURL(sourceFile);
		console.debug(`Created audio sourceFile URL: ${sourceFile.url}`);
		player.src = sourceFile.url;
		
		// Init audio context
		if (audioCtx == undefined || audioSource == undefined) {
			audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			audioSource = audioCtx.createMediaElementSource(player);

			$filterManager.init(audioCtx, audioSource);
		}

		// Default: no filters
		audioSource.connect(audioCtx.destination);

		/*const fl = lowpass(audioCtx);
		
		audioSource.connect(fl);
		fl.connect(audioCtx.destination);

		console.log(fl);
		console.log(audioSource);*/
	};

	const getFile = async () => {
		if (audioCtx == undefined || sourceFile == undefined) {
			throw "No audio";
		}

		const data = await renderAudio(audioCtx, 2, player.duration, sourceFile, $filterManager.getFilters());
		const url = URL.createObjectURL(data);

		return {
			name: sourceFile.name,
			url: url
		};
	};

	onDestroy(clearSourceURL);
</script>

<div class="container">
	<div class="player">
		{#if sourceFile == undefined}
			<InfoBox type="warn" text="No audio" />
		{:else}
			<InfoBox type="info" text={`Current audio: ${sourceFile.name.split('.')[0]}`} />
		{/if}

		<audio bind:this={player} controls="controls"></audio>
	</div>

	<div class="buttons">
		<FileUploadButton on:upload={onUpload} label="Upload audio" accept="audio/*" style="margin-bottom: 0.25rem;" />
		<FileDownloadButton {getFile} label="Download audio" waitingLabel="Rendering audio.." />
	</div>
</div>

<style lang="scss">
	div.container {
		display: flex;

		div.player {
			display: flex;
			align-items: center;
			flex-flow: column;
			width: 75%;
			
			audio {
				width: 100%;
				margin-top: 0.5rem;
			}
		}

		div.buttons {
			margin-left: 0.5rem;
			display: flex;
			flex-flow: column;	
			align-items: center;
			justify-content: center;
		}
	}
</style>
