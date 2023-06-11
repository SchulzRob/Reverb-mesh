<script>
	export let icon;
	export let href;
	export let label;
	export let width = 32;
	export let height = 32;
</script>

<a {href} target="_blank">
	<img src={icon} alt={label} {width} {height}>
	<span>{label}</span>
</a>

<style lang="scss">
	a {
		display: flex;
		align-items: center;
		text-decoration: none;

		&:visited {
			color: inherit;
		}

		span {
			font-weight: bold;
		}
	}
</style>
