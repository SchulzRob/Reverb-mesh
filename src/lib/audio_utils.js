import audiobufferToBlob from 'audiobuffer-to-blob';

export class FilterManager {
	constructor() {
		this.ready = false;
		this.filters = {};
	}

	init(audioCtx, audioSource) {
		this.audioCtx = audioCtx;
		this.audioSource = audioSource;
		this.filters = {};

		this.ready = true;
	}

	verifyReady() {
		if (!this.ready) {
			//console.error('The filter manager has not been initialized yet!');
			return false;
		}

		return true;
	}

	/**
	 * Applies a filter to the underlying audio context of this filter manager.
	 * @param {string} id the name/id of the filter
	 * @param {function(AudioContext) -> AudioNode} makeFilter function that creates the filter node
	 * @returns {boolean} true if the filter was applied; false otherwise
	 */
	addFilter(id, makeFilter) {
		if (!this.verifyReady()) {
			return false;
		}

		if (id in this.filters) {
			console.log(`Could not apply filter ${id}: Already applied`);
			return false;
		}	

		const filter = makeFilter(this.audioCtx);
		this.filters[id] = {
			'makeFilter': makeFilter,
			'filter': filter
		};

		this.audioSource.connect(filter);
		filter.connect(this.audioCtx.destination);

		// Don't pipe original audio into output
		if (Object.keys(this.filters).length == 1) {
			this.audioSource.disconnect(this.audioCtx.destination);
		}
		console.log(`Applied filter ${id}`);

		return true;
	}

	/**
	 * Removes a filter from the underlying audio context of this filter manager.
	 * @param {string} id the name/id of the filter
	 * @returns {boolean} true if the filter was removed; false otherwise
	 */
	removeFilter(id) {
		if (!this.verifyReady()) {
			return false;
		}

		if (!id in this.filters) {
			console.log(`Could not remove filter ${id}: Not applied`);
			return false;
		}
		
		const { makeFilter, filter } = this.filters[id];
		filter.disconnect({ 'destination': this.audioCtx.destination });
		this.audioSource.disconnect(filter);

		// Pipe original audio into output if no filters are applied
		if (Object.keys(this.filters).length == 1) {
			this.audioSource.connect(this.audioCtx.destination);
		}
		console.log(`Removed filter ${id}`);

		return delete this.filters[id];
	}

	
	// Add Eq-functionality

	/**
	 * Add the Eq-Filter to the this.filters and pipe them 
	 * @param {function(audioCtx) -> AudioNode[] } initEq function that creates a List with the Eq filters
	 * @returns 
	 */
	applyEq(initEq) {
		if (!this.verifyReady()) {
			return false;
		}

		const filterIds = ["32", "64", "125", "250", "500", "1000", "2000", "4000", "8000", "16000"];
		
		for (let i = 0; i < 10; i++) {
			if (filterIds[i] in this.filters) {
				console.log(`Could not apply filter ${filterIds[i]}: Already applied`);
				return false;
			}
		}

		// Creating list with Eq-filter
		let filterList = initEq(this.audioCtx);

		// Add Eq-filter to this.filters
		for (let i = 0; i < 10; i++) {
			this.filters[filterIds[i]] = {
				'makeFilter': initEq,
				'filter': filterList[i]
			};
		}

		// Pipe this.filters[Eq-filter Ids]
		for (let i = -1; i < 10; i++) {
			switch (i) {
				case -1:
					this.audioSource.connect(filterList[0]);
					break;
				case 9:
					filterList[i].connect(this.audioCtx.destination);
					break;
				default:
					filterList[i].connect(filterList[i+1]);
			}        
		}
	}

	/**
	 * Update gain from filter (this.filters) with given id to given value
	 * @param {string} id 
	 * @param {number} gainInput 
	 */
	updateGain(id, gainInput) {
		const { makeFilter, filter } = this.filters[id];
		filter.gain.value = gainInput;
	}





	/**
	 * @returns {list[object[makeFilter, filter]]} the applied filters. makeFilter is the function used to create the filter
	 * 											   whereas filter is the AudioNode that was returned from that function.
	 */
	getFilters() {
		return Object.values(this.filters);
	}

	/**
	 * Checks if a filter is applied.
	 * @returns {boolean} true if the filter is applied; false otherwise
	 */
	filterIsApplied(id) {
		if (!this.verifyReady()) {
			return false;
		}

		return id in this.filters;
	}

	close() {	
		this.ready = false;

		this.audioCtx.close();
		this.audioCtx = undefined;
		this.audioSource = undefined;
		this.filters = {};
	}
}

// Renders audio to a .wav file
export const renderAudio = async (audioCtx, channelCount, duration, file, filters) => {
	const offlineCtx = new window.OfflineAudioContext(channelCount, audioCtx.sampleRate * duration, audioCtx.sampleRate);

	const source = offlineCtx.createBufferSource();
	source.buffer = await audioCtx.decodeAudioData(await file.arrayBuffer());	

	// Apply filters
	if (filters != undefined && filters.length > 0) {
		for (const filter of filters) {
			const f = filter.makeFilter(offlineCtx);
			
			source.connect(f);
			f.connect(offlineCtx.destination);
		}
	} else {
		source.connect(offlineCtx.destination);
	}

	source.start();

	return audiobufferToBlob(await offlineCtx.startRendering());	
};
