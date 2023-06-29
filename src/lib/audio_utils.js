import audiobufferToBlob from 'audiobuffer-to-blob';
import filterDefaultIcon from '$static/images/filter_default.svg';

export const MAX_NUM = 3.4028234663852886e+38;

export class FilterOption {
	constructor(name, minValue, maxValue, defaultValue, apply) {
		this.name = name;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this._value = defaultValue;
		this.defaultValue = defaultValue;
		// filter, option => void
		// used to apply option values on filter
		this._apply = apply;
	}

	set value(value) {
		const old = this._value;
		this._value = value;

		if (this.valueListener != undefined) {
			this.valueListener(old, value);
		}
	}
	
	get value() {
		return this._value;
	}

	setValueListener(listener) {
		this.valueListener = listener;	
	}

	apply(filter) {
		this._apply(filter, this);
	}

	clone() {
		return new FilterOption(this.name, this.minValue, this.maxValue, this.defaultValue, this._apply.bind({}));
	}
}

export class Filter {
	constructor(id, makeFilter, icon, options=undefined) {
		this.id = id;
		this.makeFilter = makeFilter;
		this.options = options;
		this.icon = icon == undefined ? filterDefaultIcon : icon;

		// Apply options on filter every time their values change
		if (options != undefined) {
			for (const option of options) {
				option.setValueListener((oldValue, newValue) => {
					if (this.filter != undefined) {
						option.apply(this.filter);
					}
				});
			}
		}
	}

	make(audioCtx) {
		if (!this.filter) {
			this.filter = this.makeFilter(audioCtx);

			// Apply options on new filter
			if (this.options) {
				for (const option of this.options) {
					option.apply(this.filter);
				}
			}
		}

		return this.filter;
	}
}

export class FilterManager {
	constructor() {
		this.ready = false;
		this.filters = {};
	}

	init(audioCtx, audioSource) {
		this.audioCtx = audioCtx;
		this.audioSource = audioSource;
		this.filters = {};
		this.originSrc = audioSource;

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

		// Check if makeFilter is a function or class instance
		let filter;
		if (makeFilter.id) {
			filter = makeFilter.make(this.audioCtx);
			this.filters[id] = {
				'makeFilter': makeFilter.makeFilter,
				'filter': filter,
				'holder': makeFilter
			};
		} else {
			filter = makeFilter(this.audioCtx);
			this.filters[id] = {
				'makeFilter': makeFilter,
				'filter': filter
			};
		}
	
		this.audioSource.connect(filter);
		filter.connect(this.audioCtx.destination);

		// Don't pipe original audio into output
		if ('32' in this.filters) {
			if (Object.keys(this.filters).length == 11) {
				this.audioSource.disconnect(this.audioCtx.destination);
			}
		} else {
			if (Object.keys(this.filters).length == 1) {
				this.audioSource.disconnect(this.audioCtx.destination);
			}
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

		const { makeFilter, filter, holder } = this.filters[id];
		filter.disconnect({ 'destination': this.audioCtx.destination });
		this.audioSource.disconnect(filter);

		if (holder) {
			holder.filter = undefined;
		}

		// Pipe original audio into output if no filters are applied
		if ('32' in this.filters) {
			if (Object.keys(this.filters).length == 11) {
				this.audioSource.connect(this.audioCtx.destination);
			}
		} else {
			if (Object.keys(this.filters).length == 1) {
				this.audioSource.connect(this.audioCtx.destination);
			}
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
					const filter32 = this.filters[filterIds[0]];
					this.originSrc.connect(filter32.filter);
					console.log(`Audiosource connected to Filter32`);
					break;
				case 9:
					const filter16000 = this.filters[filterIds[i]];

					// If no other filters are applied, connect last filter to dest and disconnect source from dest
					if (Object.keys(this.filters).length == 10) {
						this.audioSource.disconnect(this.audioCtx.destination);
						console.log(`Source disconnected from destination`);
						filter16000.filter.connect(this.audioCtx.destination);
						console.log(`Filter16000 connected to destination`);
					// If other filters are applied, skip Eq-filter and connect last Eq-filter with the other filers and disconnect them from source
					} else {
						for (const filterID in this.filters) {
							if (filterIds.includes(filterID)) {
								continue;
							}
							console.log(`Eq filter skipped.`);
							const filter = this.filters[filterID];
							filter16000.filter.connect(filter.filter);
							console.log(`filter${filterIds[i]} connected to ${filterID}`);
							this.audioSource.disconnect(filter.filter);
							console.log(`Source disconneced from ${filterID}`);
						}	
					}
					break;
				default:
					const filter0 = this.filters[filterIds[i]];
					const filter1 = this.filters[filterIds[i+1]];
					filter0.filter.connect(filter1.filter);
					console.log(`Filter${filterIds[i]} connected to filter${filterIds[i+1]}`);
			}        
		}
		
		// Set last Eq-filter as audioSource, so future filter will connect to EQ
		const newSrc = this.filters[filterIds[9]].filter;
		this.audioSource = newSrc;

		console.log(`Eq applied successfully`);
	}


	/**
	 * Disconnect and delete Eq-Filter
	 * @returns 
	 */
	disconnectEq() {
		if (!this.verifyReady()) {
			return false;
		}

		const filterIds = ["32", "64", "125", "250", "500", "1000", "2000", "4000", "8000", "16000"];
		
		for (let i = 0; i < 10; i++) {
			if (!filterIds[i] in this.filters) {
				console.log(`Could not remove filter ${filterIds[i]}: Not applied`);
				return false;
			}
		}

		// unpipe this.filters[Eq-filter Ids]
		for (let i = -1; i < 10; i++) {
			switch (i) {
				case -1:
					const filter32 = this.filters[filterIds[0]];
					this.originSrc.disconnect(filter32.filter);
					console.log(`Audiosource disconnects from Filter32`);
					break;
				case 9:
					// !! Important !!  Reset audioSource
					this.audioSource = this.originSrc;
					const filter16000 = this.filters[filterIds[i]];
					
					// If no other filters are applied, disconnect last filter from dest and connect Source with dest
					if (Object.keys(this.filters).length == 10) {
						filter16000.filter.disconnect(this.audioCtx.destination);
						console.log(`Filter16000 disconnects from destination`);
						this.audioSource.connect(this.audioCtx.destination);
						console.log(`No more filters applied. Src connected to dest`);
					// If other filters are applied, skip Eq-filter and connect audioSource with other filters and disconnect last Eq-filter from them.
					} else {
						for (const filterID in this.filters) {
							if (filterIds.includes(filterID)) {
								continue;
							}
							console.log(`Eq filter skipped.`);
							const filter = this.filters[filterID];
							this.audioSource.connect(filter.filter);
							console.log(`audioSource connected to ${filterID}`);
							filter16000.filter.disconnect(filter.filter);
							console.log(`Filter16000 disconneced from ${filterID}`);
						}	
					}
					break;
				default:
					let filter0 = this.filters[filterIds[i]];
					let filter1 = this.filters[filterIds[i+1]];
					filter0.filter.disconnect(filter1.filter);
					console.log(`filter${filterIds[i]} disconneced from filter${filterIds[i+1]}`);
			}        
		}

		// delete filter
		for (let i = 0; i < 10; i++) {
			delete this.filters[filterIds[i]];
		}
		console.log(`EQ-filter deleted successfully`);

		console.log(`EQ removed successfully`);
	}

	/**
	 * Update gain from filter (this.filters) with given id to given value
	 * @param {string} id 
	 * @param {number} gainInput 
	 */
	updateGain(id, gainInput) {
		const { makeFilter, filter } = this.filters[id];
		filter.gain.value = gainInput;
		console.log(`Filter${id}.gain = ${this.filters[id].filter.gain.value}`);
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
