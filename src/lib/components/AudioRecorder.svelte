<script>
	import Button from './Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { secondsToMMSS } from '$lib/utils.js';

	export let getAudioCtx;

	const dispatch = createEventDispatcher();

	let mediaRecorder;
	let timeInterval;
	let seconds = 0;
	const onClick = () => {
		if (mediaRecorder) {
			mediaRecorder.stop();
			mediaRecorder = undefined;
			clearInterval(timeInterval);
			seconds = 0;
			return;
		}
		
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
					console.log('Stopped recording');
				};

				mediaRecorder.start();
				timeInterval = setInterval(() => seconds++, 1000);
				console.log('Started recording');
			});
	};

	const formatSeconds = seconds => {
		return secondsToMMSS(seconds);
	};

</script>

<Button label={mediaRecorder ? `Stop recording ${formatSeconds(seconds)}` : 'Start recording'} on:click={onClick} />
