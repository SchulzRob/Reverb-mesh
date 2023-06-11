<script>
	export let color = 'black';
	export let backgroundColor = 'white';
</script>

<div style:--color={color} style:--background-color={backgroundColor}></div>

<style lang="scss">
	@import 'variables';

	$size: $button-icon-size;
	$border-size: $size * 0.2;

	div {
		box-sizing: border-box;
		border: $border-size solid var(--background-color);
		border-radius: 50%;
		border-top: $border-size solid var(--color);
		width: $size;
		height: $size;
		animation: spin 1s linear infinite;
	}
		
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>
