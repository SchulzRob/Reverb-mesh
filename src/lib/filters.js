import { FilterOption, Filter, MAX_NUM } from '$lib/audio_utils.js';
import lowpassIcon from '$static/images/lowpass.svg';


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
const detuneOption = new FilterOption('detune', -MAX_NUM, MAX_NUM, 0, (filter, option) => filter.detune.value = option.value);
const frequencyOption = new FilterOption('frequency', 0, 24000, 200, (filter, option) => filter.frequency.value = option.value);
const gainOption = new FilterOption('gain', -MAX_NUM, 10, 0, (filter, option) => filter.gain.value = option.value);
const qOption = new FilterOption('frequency', -MAX_NUM, 10, 1, (filter, option) => filter.Q.value = option.value);

const lowpassFilter = new Filter('lowpass', lowpass, lowpassIcon, [frequencyOption.clone()]);
const lowpass2Filter = new Filter('lowpass2', lowpass2, lowpassIcon, [frequencyOption.clone(), gainOption.clone()]);
const lowpass3Filter = new Filter('lowpass3', lowpass, lowpassIcon);

export default [
	lowpassFilter,
	lowpass2Filter,
	lowpass3Filter
];
