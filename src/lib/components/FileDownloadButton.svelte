<script>
	export let getFile;
	export let label = 'Download file';
	export let waitingLabel = 'Preparing download..';
	export let style = '';

	import Button from './Button.svelte';
	import Notification from './Notification.svelte';
	import icon from '$static/images/download.svg'; 

	const downloadURL = (url, name) => {
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = name; 
		anchor.click();
	};

	const downloadFile = async () => {
		const file = await getFile();

		if (file == undefined || file.url == undefined) {
			console.warn('Cannot download empty url!');
			return;
		}

		downloadURL(file.url, file.name);
		URL.revokeObjectURL(file.url);
	}

	let promise = Promise.resolve();
</script>

{#await promise}
	<Button {icon} label={waitingLabel} state="loading" {style} />
{:then}
	<Button {icon} {label} on:click={() => promise = downloadFile()} {style} />
{:catch error}
	<Button {icon} {label} on:click={() => promise = downloadFile()} {style} />
	<Notification text={error} />
{/await}
