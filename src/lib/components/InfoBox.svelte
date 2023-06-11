<script>
	export let type;
	export let text;
	export let style = '';

	import exclamationCircle from '$static/images/exclamation-circle.svg';
	import infoCircle from '$static/images/info-circle.svg';

	const icons = {
		'info': infoCircle,
		'warn': exclamationCircle
	};

	const getIcon = type => {
		if (type in icons) {
			return icons[type];
		} else {
			return icons['info'];
		}	
	};
</script>

<div class={type} {style}>
	<img src={getIcon(type)} alt={type}>
	<span>{text}</span>
</div>

<style lang="scss">
	@import 'variables';

	div {
		width: max-content;
		margin: 0.25rem 0;
		padding: 0.5rem 0.75rem;
		text-align: center;
		border: 2px solid black;
		display: flex;
		align-items: center;
	
		img {
			width: $button-icon-size;
			height: $button-icon-size;
			margin-right: 0.75rem;
		}

		&.info {
			$info-color: $primary-blue;
			border-color: $info-color;
			background-color: lighten($info-color, 25%);
		}

		&.warn {
			$warn-color: $primary-yellow;
			border-color: $warn-color;
			background-color: lighten($warn-color, 40%);
		}
	}
</style>
