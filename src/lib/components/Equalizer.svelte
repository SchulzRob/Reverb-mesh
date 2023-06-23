<script>
	import { filterManager } from "$lib/stores/stores.js";
	import { add_iframe_resize_listener, bind } from "svelte/internal";

	// Use filterManager.addFilter and filterManager.removeFilter to add / remove filters
	// (See the definition of class FilterManager in src/lib/audio_utils.js for more information and docs)

	// Constants for Slider
	export const min = -10;
	export const max = 10;
	export const step = 1;

	// More Constants
	const octaveString = [
		"32",
		"64",
		"125",
		"250",
		"500",
		"1000",
		"2000",
		"4000",
		"8000",
		"16000",
	];
	const octaves = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
	let updater = "Eq not initialized";
	let state = 2;
	let bool = true;
	let applied = false;

	// Initialise Slider-Inputs
	export let input = [];
	// Set input-default to 0;
	for (let i = 0; i < 10; i++) {
		input[i] = 0;
		//document.getElementById(`filter${octaveString[i]}`).disabled = bool;
	}

	

	function toggleEq() {
		// Set state for switch
		let ready = $filterManager.verifyReady();
		if (ready) {
			if (!applied ) {
				state = 0;
			} else {
				state = 1;
			}
		} else {
			state = 2;
		}
		
		updater = "state = "+state;
		switch (state) {
			case 0:
				$filterManager.applyEq(initEq(audioCtx));
				//filterManager.set($filterManager);
				updater = "Filter erstellt";

				// Add EventListener for slider
				let sliderList = [];
				for (let i = 0; i < 10; i++) {
					sliderList[i] = document.getElementById(`filter${octaveString[i]}`);
					sliderList[i].addEventListener("input", function() {
						updateFilter(i, input[i]);
					}, false);
				}

				applied = true;
				updater = "Eq applied successfully";
				break;
			case 1:
				// Remove eq-filter
				for (let i = 0; i < 10; i++) {
					$filterManager.removeFilter(octaveString[i]);
					//filterManager.set($filterManager);
				}
		
				// Disable Gui
				for (let i = 0; i < 10; i++) {
					document.getElementById(`filter${octaveString[i]}`).disabled = bool;
				}
				bool = !bool;

				applied = false;
				updater = "Eq removed successfully";
				break;
			case 2:
				updater = "No audio"
				break;
			default:
				
				updater = "Fehler";
		}
	}

	// update filter gain
	function updateFilter(i, input) {
			$filterManager.updateGain(octaveString[i], input);
			filterManager.set($filterManager);
	}

	// Filter

	function initEq(audioCtx) {
		// Create filterList
		let filterList = [];
		for (let i = 0; i < 10; i++) {
			filterList[i] = audioCtx.createBiquadFilter();
		}

		// Fill filterList
		for (let i = 1; i < 9; i++) {
			switch (i) {
				case 0:
					filterList[i].type = "lowshelf";
					filterList[i].frequency.value = 45.18;
					break;
				case 9:
					filterList[i].type = "highshelf";
					filterList[i].frequency.value = 11312;
					break;
				default:
					filterList[i].type = "peaking";
					filterList[i].Q.value = 1.4;
					filterList[i].frequency.value = octaves[i];
			}
		}

		return filterList;
	}
</script>

<div>
	<button on:click={toggleEq}> <h2>Equalizer</h2> </button>
	<p bind:textContent={updater} contenteditable=false>Eq not applied</p>
	<table>
		<tr>
			<th>Freq</th>
			<th />
			<th>Gain</th>
		</tr>
		<tr>
			<td>32Hz</td>
			<td
				><input
					type="range"
					id="filter32"
					{min}
					{max}
					{step}
					bind:value={input[0]}
				/></td
			>
			<td>{input[0]}</td>
		</tr>
		<tr>
			<td>64Hz</td>
			<td
				><input
					type="range"
					id="filter64"
					{min}
					{max}
					{step}
					bind:value={input[1]}
				/></td
			>
			<td>{input[1]}</td>
		</tr>
		<tr>
			<td>125Hz</td>
			<td
				><input
					type="range"
					id="filter125"
					{min}
					{max}
					{step}
					bind:value={input[2]}
				/></td
			>
			<td>{input[2]}</td>
		</tr>
		<tr>
			<td>250Hz</td>
			<td
				><input
					type="range"
					id="filter250"
					{min}
					{max}
					{step}
					bind:value={input[3]}
				/></td
			>
			<td>{input[3]}</td>
		</tr>
		<tr>
			<td>500Hz</td>
			<td
				><input
					type="range"
					id="filter500"
					{min}
					{max}
					{step}
					bind:value={input[4]}
				/></td
			>
			<td>{input[4]}</td>
		</tr>
		<tr>
			<td>1kHz</td>
			<td
				><input
					type="range"
					id="filter1000"
					{min}
					{max}
					{step}
					bind:value={input[5]}
				/></td
			>
			<td>{input[5]}</td>
		</tr>
		<tr>
			<td>2kHz</td>
			<td
				><input
					type="range"
					id="filter2000"
					{min}
					{max}
					{step}
					bind:value={input[6]}
				/></td
			>
			<td>{input[6]}</td>
		</tr>
		<tr>
			<td>4kHz</td>
			<td
				><input
					type="range"
					id="filter4000"
					{min}
					{max}
					{step}
					bind:value={input[7]}
				/></td
			>
			<td>{input[7]}</td>
		</tr>
		<tr>
			<td>8kHz</td>
			<td
				><input
					type="range"
					id="filter8000"
					{min}
					{max}
					{step}
					bind:value={input[8]}
				/></td
			>
			<td>{input[8]}</td>
		</tr>
		<tr>
			<td>16kHz</td>
			<td
				><input
					type="range"
					id="filter16000"
					{min}
					{max}
					{step}
					bind:value={input[9]}
				/></td
			>
			<td>{input[9]}</td>
		</tr>
	</table>
</div>

<style lang="scss">
	div {
		padding: 0.25rem 1rem;
	}
</style>
