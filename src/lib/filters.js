import { FilterOption, Filter, MAX_NUM } from '$lib/audio_utils.js';


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

// Filter options
const detuneOption = new FilterOption('frequency', -MAX_NUM, MAX_NUM, 0, (filter, option) => filter.detune.value = option.value);
const frequencyOption = new FilterOption('frequency', -24000, 24000, 200, (filter, option) => filter.frequency.value = option.value);
const gainOption = new FilterOption('gain', -MAX_NUM, MAX_NUM, 0, (filter, option) => filter.gain.value = option.value);
const qOption = new FilterOption('frequency', -MAX_NUM, MAX_NUM, 1, (filter, option) => filter.Q.value = option.value);

const lowpassFilter = new Filter('lowpass', lowpass, [frequencyOption.clone()]);
const lowpass2Filter = new Filter('lowpass2', lowpass2, [frequencyOption.clone(), gainOption.clone()]);

export default [
	lowpassFilter,
	lowpass2Filter
];
