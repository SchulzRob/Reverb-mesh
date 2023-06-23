import { FilterOption, Filter, MAX_NUM } from '$lib/audio_utils.js';
import lowpassIcon from '$static/images/lowpass.svg';


//Simple Biquad audioFilter
export const lowpass = audioCtx => {
    const audioFilter = audioCtx.createBiquadFilter();

    audioFilter.type = 'lowpass';
    audioFilter.frequency.value = 200;
    audioFilter.Q.value = 1;

    return audioFilter;
};

export const highpass = audioCtx => {
    const audioFilter = audioCtx.createBiquadFilter();

    audioFilter.type = 'highpass';
    audioFilter.frequency.value = 1000;
    audioFilter.Q.value = 0.7071;

    return audioFilter;
};

export const bandpass = audioCtx => {
    const audioFilter = audioCtx.createBiquadFilter();

    audioFilter.type = 'bandpass';
    audioFilter.frequency.value = 1000;
    audioFilter.Q.value = 1;

    return audioFilter;
};

export const highshelf = audioCtx => {
    const audioFilter = audioCtx.createBiquadFilter();

    audioFilter.type = 'highpass';
    audioFilter.frequency.value = 4000;
    audioFilter.gain.value = 6;

    return audioFilter;
};

export const lowshelf = audioCtx => {
    const audioFilter = audioCtx.createBiquadFilter();

    audioFilter.type = 'lowshelf';
    audioFilter.frequency.value = 100;
    audioFilter.gain.value = 6;

    return audioFilter;
};


export const peaking = audioCtx => {
    const audioFilter = audioCtx.createBiquadFilter;

    audioFilter.type = 'peaking';
    audioFilter.frequency.value = 1000;
    audioFilter.Q.value = 1;
    audioFilter.gain.value = 6;

    return audioFilter;
};

export const notch = audioCtx => {
    const audioFilter = audioCtx.createBiquadFilter();

    audioFilter.type = 'notch';
    audioFilter.frequency.value = 1000;
    audioFilter.Q.value = 10;

    return audioFilter;
};

export const allhpass = audioCtx => {
    const audioFilter = audioCtx.createBiquadFilter();

    audioFilter.type = 'allpass';
    audioFilter.frequency.value = 1000;
    audioFilter.Q.value = 0.5;

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

// Filter options
const detuneOption = new FilterOption('frequency', -MAX_NUM, MAX_NUM, 0, (filter, option) => filter.detune.value = option.value);
const frequencyOption = new FilterOption('frequency', -24000, 24000, 200, (filter, option) => filter.frequency.value = option.value);
const gainOption = new FilterOption('gain', -MAX_NUM, MAX_NUM, 0, (filter, option) => filter.gain.value = option.value);
const qOption = new FilterOption('frequency', -MAX_NUM, MAX_NUM, 1, (filter, option) => filter.Q.value = option.value);

const lowpassFilter = new Filter('LowPass', lowpass, lowpassIcon, [frequencyOption.clone()]);
const lowpassFilter = new Filter('HighPass', highpass, lowpassIcon, [frequencyOption.clone()]);
const lowpassFilter = new Filter('lowpass', lowpass, lowpassIcon, [frequencyOption.clone()]);
const lowpassFilter = new Filter('lowpass', lowpass, lowpassIcon, [frequencyOption.clone()]);
const lowpassFilter = new Filter('lowpass', lowpass, lowpassIcon, [frequencyOption.clone()]);const lowpassFilter = new Filter('lowpass', lowpass, lowpassIcon, [frequencyOption.clone()]);
const lowpass2Filter = new Filter('lowpass2', lowpass2, lowpassIcon, [frequencyOption.clone(), gainOption.clone()]);
const lowpass3Filter = new Filter('lowpass3', lowpass, lowpassIcon);
export default [
	lowpassFilter,
	lowpass2Filter,
	lowpass3Filter
];
export default [
    constructFilter('LowPass', lowpass),
    constructFilter('HighPass', highpass),
    constructFilter('LowShelf', lowshelf),
    constructFilter('HiighShelf', highshelf),
    constructFilter('BandPass', bandpass),
    constructFilter('Peaking', peaking),
    constructFilter('Notch', notch),
    // constructFilter('Reverb', distortion),
    // constructFilter('Distortion', distortion),
    // constructFilter('Pitch-Shifter', pitchShifter),
    // constructFilter('Phaser', phaser),
    // constructFilter('Bitcrusher', bitcrusher),
    // constructFilter('Reverse-Delay', reverseDelay),
    constructFilter('Delay-with-Feedback', delayWithFeedback),
    constructFilter('Wah-wah', wahWah),
   // constructFilter('FM', fm),
    constructFilter('Flanger', flanger),
    constructFilter('Tremolo', tremolo),
    constructFilter('AllPass', allhpass)//,
//  ... getTestaudioFilters() // TODO Test audioFilters
];





