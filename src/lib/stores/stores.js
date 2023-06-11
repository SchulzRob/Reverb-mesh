import { readable, writable } from 'svelte/store';
import { FilterManager } from '$lib/audio_utils.js';

/*export const filterManager = readable(new FilterManager(), set => {
	return () => {};
});*/

export const filterManager = writable(new FilterManager());
