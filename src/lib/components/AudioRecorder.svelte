<script>
	export let getAudioCtx;

	import Button from './Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { secondsToMMSS } from '$lib/utils.js';
	import recordIcon from '$static/images/record.svg';
	import recordFillIcon from '$static/images/record-fill.svg';
	

	const dispatch = createEventDispatcher();

	let mediaRecorder;
	let timeInterval;
	let seconds = 0;
	const onClick = () => {
		if (mediaRecorder) {
			// Stop recording
			mediaRecorder.stop();
			mediaRecorder = undefined;
			clearInterval(timeInterval);
			seconds = 0;
			return;
		}
		
		// Start recording
		navigator.mediaDevices
			.getUserMedia({audio: true, video: false})
			.then(async stream => {
				const source = getAudioCtx().createMediaStreamSource(stream);

				const mimeType = 'audio/ogg; codecs=opus';
				const recordedChunks = [];
				mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });

				mediaRecorder.ondataavailable = evt => {
					if (evt.data.size > 0) {
						recordedChunks.push(evt.data);
					}
				};

				mediaRecorder.onstop = () => {
					const blob = new Blob(recordedChunks, { type: mimeType });
					blob.name = 'Recording.wav';
					blob.url = URL.createObjectURL(blob);
					dispatch('data', blob);
					console.debug('Stopped recording');
				};

				mediaRecorder.start();
				timeInterval = setInterval(() => seconds++, 1000);
				console.debug('Started recording');
			});
	};

	const formatSeconds = seconds => {
		return secondsToMMSS(seconds);
	};

</script>

{#if mediaRecorder}
	<Button icon={recordFillIcon} label={`Stop recording ${formatSeconds(seconds)}`} on:click={onClick} />
{:else}
	<Button icon={recordIcon} label={'Record audio'} on:click={onClick} />
{/if}
