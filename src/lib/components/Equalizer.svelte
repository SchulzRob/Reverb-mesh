<script>
	import { filterManager } from "$lib/stores/stores.js";
	import { add_iframe_resize_listener, bind } from "svelte/internal";
	import { onMount } from 'svelte';

	// Use filterManager.addFilter and filterManager.removeFilter to add / remove filters
	// (See the definition of class FilterManager in src/lib/audio_utils.js for more information and docs)

	// const for Slider
	export const min = -10;
	export const max = 10;
	export const step = 1;

	// eq vars
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
	// displays button actions
	let updater = "Eq not initialized";
	// Boolean for toggle EQGui
	let bool = false;

	// Initialize Slider-Inputs
	export let input = [];
	// Set input-default to 0;
	for (let i = 0; i < 10; i++) {
		input[i] = 0;		
	}


	// Disable sliders when intitialized
	onMount(() => {
		toggleEqGui(true);
	});


	let state;
	let applied = false;
	/**
	 * function called by Eq-Button. 
	 * Cases:
	 * 0: 	-Applies Eq to audio -> creating filter via filtermanager calls
	 * 		-Enable slider-Gui
	 * 1: 	-Removes Eq from audio -> deleting filter via filtermanager calls
	 * 		-Disable slider-Gui
	 * 2: 	-Nothing. Shows Message that there is no audio
	 */
	function toggleEq() {
		// Set state for switch
		let ready = $filterManager.verifyReady();
		// filtermanager is initialized
		if (ready) {
			// Eq is NOT already applied
			if (!applied ) {
				state = 0;
			// Eq is already applied
			} else {
				state = 1;
			}
		// filtermanager is NOT initialized
		} else {
			state = 2;
		}
		
		updater = "state = "+state;
		switch (state) {
			// apply Eq
			case 0:
				// create filter and apply them
				$filterManager.applyEq(initEq);
				//filterManager.set($filterManager);
				updater = "Filter erstellt";

				// disable Gui
				toggleEqGui(bool);
				bool = true;

				applied = true;
				updater = "Eq applied successfully";
				break;
			// remove Eq
			case 1:
				// Remove eq-filter
				$filterManager.disconnectEq();
				
				// Reset slider
				for (let i = 0; i < 10; i++) {
					input[i] = 0;
				}

				// disable Gui
				toggleEqGui(bool);
				bool = false;

				applied = false;
				updater = "Eq removed successfully";
				break;
			// filtermanger not initialized
			case 2:
				updater = "No audio"
				toggleEqGui(true);
				break;
			default:
				updater = "Fehler";
		}
	}


	/**
	 * Enable/Disable Eq-slider
	 * @param bool boolean
	 */
	function toggleEqGui (bool) {
		for (let i = 0; i < 10; i++) {
			document.getElementById(`filter${octaveString[i]}`).disabled = bool;
		}
	}


	/**
	 * Called, when a slider-value has:inputd.
	 * Update Eq-filter gains via updateFilter (via filtermanager)
	 */
	function evtLst() {
		for (let i = 0; i < 10; i++) {
			updateFilter(octaveString[i], input[i]);
		}
	}


	/**
	 * Update gain of filter with given index (Id) via filtermanager-call
	 * @param i index of octaveString to get filter-ID
	 * @param input value that became the new gain
	 */
	function updateFilter(id, input) {
			$filterManager.updateGain(id, input);
			//filterManager.set($filterManager);
	}


	/**
	 * Function that can be passed to filtermanager as equivalent to makeFilter
	 * Creates a List of the Eq-filter
	 * @param audioCtx audioContext to create Filter
	 */
	function initEq(audioCtx) {
		// Create filterList
		let filterList = [];
		for (let i = 0; i < 10; i++) {
			filterList[i] = audioCtx.createBiquadFilter();
		}

		// Fill filterList
		for (let i = 0; i < 10; i++) {
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
					on:change={evtLst}
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
					on:change={evtLst}
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
					on:change={evtLst}
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
					on:change={evtLst}
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
					on:change={evtLst}
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
					on:change={evtLst}
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
					on:change={evtLst}
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
					on:change={evtLst}
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
					on:change={evtLst}
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
					on:change={evtLst}
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
