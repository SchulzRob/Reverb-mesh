import audiobufferToBlob from 'audiobuffer-to-blob';


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
		this.icon = icon;

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

		if (!(id in this.filters)) {
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
		if (Object.keys(this.filters).length == 1) {
			this.audioSource.connect(this.audioCtx.destination);
		}
		console.log(`Removed filter ${id}`);

		return delete this.filters[id];
	}

	/**
	 * Reconnects all filters by disconnecting and then connecting them again. 
	 * Useful to rewire the filters when the internal stream of the audio source is changed.
	 */
	rewireFilters() {
		if (!this.verifyReady()) {
			return false;
		}

		if (Object.keys(this.filters).length > 0) {
			this.audioSource.disconnect();

			for (const id in this.filters) {
				const { makeFilter, filter } = this.filters[id];
				filter.disconnect();
				
				this.audioSource.connect(filter);
				filter.connect(this.audioCtx.destination);
			}
		}
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
