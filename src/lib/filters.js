

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



export const flanger = audioCtx => {
    const delayNode = audioCtx.createDelay();
    delayNode.delayTime.value = 0.02;
    
    const feedbackNode = audioCtx.createGain();
    feedbackNode.gain.value = 0.5;

    const audioFilter = audioCtx.createBiquadFilter();
    audioFilter.type = 'lowpass';
    const lfoGainNode = audioCtx.createGain();
    lfoGainNode.gain.value = 0.003;
  
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5;
  
    delayNode.connect(feedbackNode);
    feedbackNode.connect(delayNode);
    delayNode.connect(audioFilter);
    audioFilter.connect(audioCtx.destination);
    lfo.connect(lfoGainNode.gain);
    lfoGainNode.connect(delayNode.delayTime);
  
    lfo.start();
  
    return delayNode;
};

export const tremolo = audioCtx => {
    const lfo = audioCtx.createOscillator();
  lfo.type = 'sine'; 
  const gainNode = audioCtx.createGain();
  lfo.frequency.value = 5; 
  gainNode.gain.value = 0.5; 
  lfo.connect(gainNode.gain);
  lfo.start();

  return gainNode;
};

export const delayWithFeedback = audioCtx => {

    const delayNode = audioCtx.createDelay();
    delayNode.delayTime.value = 0.5;
    
    
    const feedbackNode = audioCtx.createGain();
    feedbackNode.gain.value = 0.5; 
    
    const audioFilter = audioCtx.createBiquadFilter();
    audioFilter.type = 'lowpass';
    audioFilter.frequency.value = 2000; 
    
    delayNode.connect(audioFilter);
    audioFilter.connect(feedbackNode);
    feedbackNode.connect(delayNode);
    

    return feedbackNode;
};

export const wahWah = audioCtx => {
const audioFilter = audioCtx.createBiquadFilter();
audioFilter.type = 'bandpass';
audioFilter.frequency.value = 1000; 
audioFilter.Q.value = 1; 

const lfo = audioCtx.createOscillator();
const lfoGain = audioCtx.createGain();
lfo.frequency.value = 1; 
lfoGain.gain.value = 500;

lfo.connect(lfoGain);
lfoGain.connect(audioFilter.frequency);

lfo.start();

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





