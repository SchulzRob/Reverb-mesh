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

export const allpass = audioCtx => {
    const audioFilter = audioCtx.createBiquadFilter();

    audioFilter.type = 'allpass';
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

// "Advanced" Filter
export const harmonicExiter = audioCtx => {
  


    const distortionNode = audioCtx.createWaveShaper();
    distortionNode.curve = makeDistortionCurve(10); 
    
    
    const filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'highpass';
    filterNode.frequency.value = 8000; 
    
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 2;
    
    distortionNode.connect(filterNode);
    filterNode.connect(gainNode);
    
    
    
    function makeDistortionCurve(amount) {
        const curve = new Float32Array(audioCtx.sampleRate);
        const deg = Math.PI / 180;
        for (let i = 0; i < audioCtx.sampleRate; i++) {
          const x = (i * 2) / audioCtx.sampleRate - 1;
          curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      }
    
    return gainNode;
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
        
        

// Filter options
const detuneOption = new FilterOption('frequency', -MAX_NUM, MAX_NUM, 0, (filter, option) => filter.detune.value = option.value);
const frequencyOption = new FilterOption('frequency', 0, 24000, 200, (filter, option) => filter.frequency.value = option.value);
const frequencyOption2 = new FilterOption('frequency', 0, 24000, 1000, (filter, option) => filter.frequency.value = option.value);
const gainOption = new FilterOption('gain', -MAX_NUM, MAX_NUM, 0, (filter, option) => filter.gain.value = option.value);
const gainOption2 = new FilterOption('gain', -MAX_NUM, MAX_NUM, 0.5, (filter, option) => filter.gain.value = option.value);
const gainOption3 = new FilterOption('gain', -MAX_NUM, MAX_NUM, 2, (filter, option) => filter.gain.value = option.value);
const qOption = new FilterOption('q', -MAX_NUM, MAX_NUM, 1, (filter, option) => filter.Q.value = option.value);
const delayTimeOption = new FilterOption('delay time', -MAX_NUM, MAX_NUM, 0.02, (filter, option) => filter.delayTime.value = option.value);

const lowpassFilter = new Filter('LowPass', lowpass, lowpassIcon, [frequencyOption.clone(), qOption.clone()]);
const highpassFilter = new Filter('HighPass', highpass, lowpassIcon, [frequencyOption.clone(), qOption.clone()]);
const lowshelfFilter = new Filter('LowShelf', lowshelf, lowpassIcon, [frequencyOption.clone(), gainOption.clone()]);
const highshelfFilter = new Filter('HighShelf', highshelf, lowpassIcon, [frequencyOption.clone(), gainOption.clone()]);
const bandpassFilter = new Filter('BandPass', bandpass, lowpassIcon, [frequencyOption.clone(), qOption.clone()]);
const peakingFilter = new Filter('Peaking', peaking, lowpassIcon, [frequencyOption.clone(), gainOption.clone(), qOption.clone()]);
const notchFilter = new Filter('Notch', notch, lowpassIcon, [frequencyOption.clone(), qOption.clone()]);
const delayWithFeedbackFilter = new Filter('Delay-with-Feedback', delayWithFeedback, lowpassIcon);
const wahWahFilter = new Filter('Wah-wah', wahWah, lowpassIcon, [frequencyOption2.clone(),  qOption.clone()]);
const flangerFilter = new Filter('Flanger', flanger, lowpassIcon );
const tremoloFilter = new Filter('Tremolo', tremolo, lowpassIcon);
const allpassFilter = new Filter('Allpass', allpass, lowpassIcon, [frequencyOption.clone(), qOption.clone()]);
const harmonicExiterFilter = new Filter('Harmonic-Exiter', harmonicExiter, lowpassIcon,[gainOption3.clone()]);
const lowpass2Filter = new Filter('lowpass2', lowpass, lowpassIcon, [frequencyOption.clone()]);
const lowpass3Filter = new Filter('lowpass3', lowpass, lowpassIcon);

export default [
lowpassFilter,
highpassFilter,
lowshelfFilter,
highshelfFilter,
bandpassFilter,
//peakingFilter,
notchFilter,
delayWithFeedbackFilter,
wahWahFilter,
flangerFilter,
tremoloFilter,
harmonicExiterFilter,
allpassFilter
];






