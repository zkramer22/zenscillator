import Tone from 'tone';
import { Zen } from './zenscillator';

//////////////////////
// instrument setup //
//////////////////////

export const INSTRUMENTS = {
  "sine"      : new Tone.PolySynth(16, Tone.Synth).set({ oscillator: { type: 'sine' } }),
  "triangle"  : new Tone.PolySynth(16, Tone.Synth).set({ oscillator: { type: 'triangle' } }),
  "square"    : new Tone.PolySynth(16, Tone.Synth).set({ oscillator: { type: 'square' } }),
  "membrane"  : new Tone.PolySynth(2, Tone.MembraneSynth),
  "fm"        : new Tone.PolySynth(6, Tone.FMSynth)
};

// use existing click listeners to switch instrument
export const switchInst = direction => {
  const $currentInst = $('.current');

  if (direction === 'next') {
    if ($currentInst.attr('id') !== 'fm') {
      $currentInst.next().trigger('click');
    } else {
      $('#sine').trigger('click');
    }
  }
  else {
    if ($currentInst.attr('id') !== 'sine') {
      $currentInst.prev().trigger('click');
    } else {
      $('#fm').trigger('click');
    }
  }
};

// jquery attribute modifiers for instrument container below piano
export const toggleInst = (inst, color) => {
  $('.instrument').attr('class', 'instrument');
  $(`#${inst}`).toggleClass(`${color} current`);
};

export const noteOn = note => {
  if (note[0] !== "e") {
    Zen.instrument.triggerAttack(`${note}${Zen.octave}`);
  }
  else {
    Zen.instrument.triggerAttack(`${note.slice(1)}${Zen.octave + 1}`);
  }
};

export const noteOff = noteUp => {
  if (noteUp[0] !== 'e') {
    Zen.instrument.triggerRelease(`${noteUp}${Zen.octave}`);
  }
  else {
    Zen.instrument.triggerRelease(`${noteUp.slice(1)}${Zen.octave + 1}`);
  }
};

// increase instrument octave by one
export const octaveUp = ($octave, $octaveUp) => {
  if (Zen.octave < 6) {
    Zen.octave++;
    $octave.toggleClass('active');
    $octaveUp.toggleClass('keydown');
    setTimeout(() => {
      $octave.toggleClass('active');
      $octaveUp.toggleClass('keydown');
    }, 120);
  }
};

// decrease instrument octave by one
export const octaveDown = ($octave, $octaveDown) => {
  if (Zen.octave > 1) {
    Zen.octave--;
    $octave.toggleClass('active');
    $octaveDown.toggleClass('keydown');
    setTimeout(() => {
      $octave.toggleClass('active');
      $octaveDown.toggleClass('keydown');
    }, 120);
  }
};

// light up keyboard notes
export const sustainClassToggle = (note, color) => {
  $(`#${note}`).toggleClass(`${color}`).toggleClass('keydown');
};
