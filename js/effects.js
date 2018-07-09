import Tone from 'tone';
import { Zen } from './zenscillator';

//////////////////////
//// effects setup ///
//////////////////////

// Tone Effects
export const tremolo = new Tone.Tremolo(
  { frequency: "8n", type: "sine", depth: 1, spread: 0, wet: 0 }
).start();
export const autopan = new Tone.AutoPanner(
  { frequency: "4n", depth: 1, wet: 0 }
).start();
export const splash = new Tone.JCReverb(
  { roomSize: 0.8, wet: 0 }
);
export const delay = new Tone.PingPongDelay(
  { delayTime: "4n", feedback: 0.2, wet: 0 }
);
export const reverb = new Tone.Freeverb(
  { roomSize: 0.88, dampening: 2000, wet: 0 }
);
export const vibrato = new Tone.Vibrato(
  { frequency: 8, depth: 0.2, wet: 0 }
);
export const compressor = new Tone.Compressor(-24, 20);
export const limiter = new Tone.Limiter(-15);

// .wet value state for effects when turned on.
export const FXBANK = {
  "tremolo": [tremolo, 0.6],
  "autopan": [autopan, 0.6],
  "splash": [splash, 0.6],
  "delay": [delay, 0.6],
  "reverb": [reverb, 0.6],
  "vibrato": [vibrato, 0.6],
};

// keyboard keys linked to effects.
export const FXCODES = {
  '1'  : [tremolo, "down", "tremolo"],
  '2'  : [tremolo, "up", "tremolo"],
  'q'  : [tremolo, "toggle", "tremolo"],
  '3'  : [autopan, "down", "autopan"],
  '4'  : [autopan, "up", "autopan"],
  'e'  : [autopan, "toggle", "autopan"],
  '5'  : [splash, "down", "splash"],
  '6'  : [splash, "up", "splash"],
  't'  : [splash, "toggle", "splash"],
  '7'  : [delay, "down", "delay"],
  '8'  : [delay, "up", "delay"],
  'u'  : [delay, "toggle", "delay"],
  '9'  : [reverb, "down", "reverb"],
  '0'  : [reverb, "up", "reverb"],
  'o'  : [reverb, "toggle", "reverb"],
};

// effect states
export const ACTIVEFX = {
  'tremolo' : false,
  'autopan' : false,
  'splash'  : false,
  'delay'   : false,
  'reverb'  : false,
  'vibrato' : false
};

// show and hide the EFX container
export const efxPaneToggle = $efxContainer => {
  const val = Zen.efxPane ? '-205px' : '0px';
  Zen.efxPane = !Zen.efxPane;

  $efxContainer.animate({ bottom: `${val}`}, 350);
};

// turn effects on and off
export const effectToggle = (effect, effectStr) => {
  if (!ACTIVEFX[effect]) {
    effect.wet.rampTo(FXBANK[effectStr][1], .1);
    $(`.${effectStr}`)[0].value = FXBANK[effectStr][1];
    ACTIVEFX[effect] = true;
  }
  else {
    effect.wet.rampTo(0, .1);
    $(`.${effectStr}`)[0].value = 0;
    ACTIVEFX[effect] = false;
  }
  $(`#${effectStr}`).toggleClass('active');
};

// turn vibrato on and off
export const vibratoToggle = ($vibrato, $vibratoKey) => {
  if (!ACTIVEFX[vibrato]) {
    vibrato.wet.rampTo(FXBANK["vibrato"][1], .1);
    ACTIVEFX[vibrato] = true;
  }
  else {
    vibrato.wet.rampTo(0, .1);
    ACTIVEFX[vibrato] = false;
  }
  $vibrato.toggleClass('active');
  $vibratoKey.toggleClass('keydown');
  setTimeout(() => {
    $vibratoKey.toggleClass('keydown');
  }, 120);
};
