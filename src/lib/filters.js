export const lowpass = audioCtx => {
	const audioFilter = audioCtx.createBiquadFilter();

	audioFilter.type = 'lowpass';
	audioFilter.frequency.value = 200;
	audioFilter.Q.value = 1;

	return audioFilter;
};

export const lowpass2 = audioCtx => {
	const audioFilter = audioCtx.createBiquadFilter();

	audioFilter.type = 'lowpass';
	audioFilter.frequency.value = 200;
	audioFilter.Q.value = 0.2;

	return audioFilter;
};

// TODO make filter functions here

// Method signature:
// Parameters:
//   - audioCtx: AudioContext (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
//
// Return:
//   - audioFilter: AudioNode (https://developer.mozilla.org/en-US/docs/Web/API/AudioNode)
//                  (All filters are AudioNodes)




const constructFilter = (name, makeFilter) => {
	return {
		'label': name,
		'makeFilter': makeFilter 
	};
};

export const getTestFilters = () => {
	const lpass = constructFilter('LowPass', lowpass);
	const res = [lpass];

	for (let i = 0; i < 10; i++) {
		res.push(constructFilter(i%2==0 ? 'Random' : 'BandPass', undefined));	
	}

	res.push(lpass);

	return res;
};

export default [
	constructFilter('LowPass', lowpass),
	constructFilter('LowPass2', lowpass2),
	... getTestFilters() // TODO Test filters
];
