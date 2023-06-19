<script>
	import Button from './Button.svelte';
	import { createEventDispatcher } from 'svelte';

	export let getAudioCtx;

	const dispatch = createEventDispatcher();

	let mediaRecorder;
	const onClick = () => {
		if (mediaRecorder) {
			mediaRecorder.stop();
			mediaRecorder = undefined;
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
				console.log('Started recording');
			});
	};

</script>

<Button label={mediaRecorder ? 'Stop recording' : 'Start recording'} on:click={onClick} />
