import Tone from 'tone';

/////////////////////
///// analysers /////
/////////////////////

export const waveform = new Tone.Analyser(
  { size: 2048, type: 'waveform', smoothing: 1 }
);

// ##### meter analyser ##### //
// const meter = new Tone.Meter(0.8);
// instrument.connect(meter);

// ####### mic ######## //
// let mic = new Tone.UserMedia();
// mic.connect(waveform);
// .toMaster();
// mic.open();
