import Tone from 'tone';
//////////////////////
// instrument setup //
//////////////////////

const INSTRUMENTS = {
  "synth"     : Tone.Synth,
  "membrane"  : Tone.MembraneSynth,
  "fm"        : Tone.FMSynth
};

const KEYCODES = {
  90  : `C`,    // z
  83  : `Db`,   // s
  88  : `D`,    // x
  68  : `Eb`,   // d
  67  : `E`,    // c
  86  : `F`,    // v
  71  : `Gb`,   // g
  66  : `G`,    // b
  72  : `Ab`,   // h
  78  : `A`,    // n
  74  : `Bb`,   // j
  77  : `B`,    // m
  188 : `eC`,   // ,
  76  : `eDb`,  // l
  190 : `eD`,   // .
  186 : `eEb`,  // ;
  191 : `eE`,   // /
};

let instrument = new Tone.PolySynth(16, INSTRUMENTS["synth"]).toMaster();
let octave = 4;

// instrument.set({
//   oscillator: {
//     type: "sine"
//   }
// });


//////////////////////
//// effects setup ///
//////////////////////

let tremolo = new Tone.Tremolo(
  { frequency: "8n", type: "sine", depth: 0.5, spread: 0 }).toMaster().start();
let autopan = new Tone.AutoPanner("4n").toMaster().start();
let splash = new Tone.JCReverb(0.8).toMaster();
let delay = new Tone.PingPongDelay("4n", 0.2).toMaster();
let reverb = new Tone.Freeverb(0.88, 2000).toMaster();

let vibrato = new Tone.Vibrato(10, 0.5).toMaster();

const FXCODES = {
  49  : [tremolo, "down"],   // 1
  50  : [tremolo, "up"],     // 2
  81  : [tremolo, "toggle"], // q
  51  : [autopan, "down"],   // 3
  52  : [autopan, "up"],     // 4
  69  : [autopan, "toggle"], // e
  53  : [splash, "down"],    // 5
  54  : [splash, "up"],      // 6
  84  : [splash, "toggle"],  // t
  55  : [delay, "down"],     // 7
  56  : [delay, "up"],       // 8
  85  : [delay, "toggle"],   // u
  57  : [reverb, "down"],    // 9
  48  : [reverb, "up"],      // 0
  79  : [reverb, "toggle"]   // o
};

const ACTIVEFX = {
  tremolo : false,
  autopan : false,
  splash  : false,
  delay   : false,
  reverb  : false
};

//////////////////////
///// DOM manip //////
//////////////////////

// light up keyboard notes
const sustainClassToggle = (note) => {
  $(`#${note}`).toggleClass('sustained');
};

const toggleEFX = () => {
  $('#efxPane').toggleClass('invisible');
  $('#efxContainer').toggleClass('invisible');
};

//////////////////////
//// mouse events ////
//////////////////////

document.addEventListener('mouseover', (e) => {
  if (e.srcElement.id === 'efxPane') { toggleEFX() }
});

document.addEventListener('mouseout', (e) => {
  if (e.srcElement.id === 'efxPane') { toggleEFX() }
});

//////////////////////
/// keyboard events //
//////////////////////

document.addEventListener('keydown', (e) => {
  // turn on note //
  if (KEYCODES.hasOwnProperty(e.keyCode)) {
    if (e.repeat) { return null }

    switch (KEYCODES[e.keyCode][0]) {
      case "e":
        instrument.triggerAttack(`${KEYCODES[e.keyCode].slice(1)}${octave + 1}`);
        sustainClassToggle(`${KEYCODES[e.keyCode]}`);
        break;
      default:
        instrument.triggerAttack(`${KEYCODES[e.keyCode]}${octave}`);
        sustainClassToggle(`${KEYCODES[e.keyCode]}`);
        break;
    }
  }
  else if (FXCODES.hasOwnProperty(e.keyCode)) {
    let effect = FXCODES[e.keyCode][0];
    let change = FXCODES[e.keyCode][1];

    switch (change) {
      case "toggle":
        if (ACTIVEFX[effect]) {
          instrument.disconnect(effect);
          ACTIVEFX[effect] = false
        }
        else {
          instrument.connect(effect);
          ACTIVEFX[effect] = true;
        }
        break;
      case "down":
        effect.wet.value = effect.wet.value - 0.1;
        break;
      case "up":
        effect.wet.value = effect.wet.value + 0.1;
        break;
    }
  }

  // change octaves on '+' and '-' keys //
  if (e.keyCode === 187 && octave < 6) { octave++ }
  else if (e.keyCode === 189 && octave > 1) { octave-- }
});

document.addEventListener('keyup', (e) => {
  // turn off note //
  if (KEYCODES[e.keyCode][0] === 'e') {
    instrument.triggerRelease(`${KEYCODES[e.keyCode].slice(1)}${octave + 1}`);
    sustainClassToggle(`${KEYCODES[e.keyCode]}`);
  }
  else {
    instrument.triggerRelease(`${KEYCODES[e.keyCode]}${octave}`);
    sustainClassToggle(`${KEYCODES[e.keyCode]}`);
  }
});
