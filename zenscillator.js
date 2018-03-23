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
  90  : ['C', 'red'],             // z
  83  : ['Db', 'redorange'],      // s
  88  : ['D', 'orange'],          // x
  68  : ['Eb', 'orangeyellow'],   // d
  67  : ['E', 'yellow'],          // c
  86  : ['F', 'green'],           // v
  71  : ['Gb', 'teal'],           // g
  66  : ['G', 'lightblue'],       // b
  72  : ['Ab', 'blue'],           // h
  78  : ['A', 'bluepurple'],      // n
  74  : ['Bb', 'purple'],         // j
  77  : ['B', 'magenta'],         // m
  188 : ['eC', 'red'],            // ,
  76  : ['eDb', 'redorange'],     // l
  190 : ['eD', 'orange'],         // .
  186 : ['eEb', 'orangeyellow'],  // ;
  191 : ['eE', 'yellow']          // /
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

let vibrato = new Tone.Vibrato(8, 0.2).toMaster();
// add little indicator for vibrato!

// also add pitch bend! could be control and option

const FXCODES = {
  49  : [tremolo, "down", "tremolo"],   // 1
  50  : [tremolo, "up", "tremolo"],     // 2
  81  : [tremolo, "toggle", "tremolo"], // q
  51  : [autopan, "down", "autopan"],   // 3
  52  : [autopan, "up", "autopan"],     // 4
  69  : [autopan, "toggle", "autopan"], // e
  53  : [splash, "down", "splash"],     // 5
  54  : [splash, "up", "splash"],       // 6
  84  : [splash, "toggle", "splash"],   // t
  55  : [delay, "down", "delay"],       // 7
  56  : [delay, "up", "delay"],         // 8
  85  : [delay, "toggle", "delay"],     // u
  57  : [reverb, "down", "reverb"],     // 9
  48  : [reverb, "up", "reverb"],       // 0
  79  : [reverb, "toggle", "reverb"],   // o
  192 : [vibrato, "toggle", "vibrato"]  // ~
};

const ACTIVEFX = {
  tremolo : false,
  autopan : false,
  splash  : false,
  delay   : false,
  reverb  : false,
  vibrato : false
};

//////////////////////
///// DOM manip //////
//////////////////////

// light up keyboard notes
const sustainClassToggle = (note, color) => {
  $(`#${note}`).toggleClass(`${color}`);
};

const toggleEFX = () => {
  $('#efxPane').toggleClass('invisible');
  $('#efxContainer').toggleClass('invisible');
};

const toggleOn = (effectStr) => {
  $(`#${effectStr}`).toggleClass('active');
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

    const note = KEYCODES[e.keyCode][0];
    const color = KEYCODES[e.keyCode][1];

    switch (note[0]) {
      case "e":
        instrument.triggerAttack(`${note.slice(1)}${octave + 1}`);
        sustainClassToggle(`${note}`, `${color}`);
        break;
      default:
        instrument.triggerAttack(`${note}${octave}`);
        sustainClassToggle(`${note}`, `${color}`);
        break;
    }
  }
  else if (FXCODES.hasOwnProperty(e.keyCode)) {
    let effect = FXCODES[e.keyCode][0];
    let change = FXCODES[e.keyCode][1];
    let effectStr = FXCODES[e.keyCode][2];

    if ((e.repeat) && (change === "toggle")) { return null }

    switch (change) {
      case "toggle":
        if (ACTIVEFX[effect]) {
          instrument.disconnect(effect);
          ACTIVEFX[effect] = false;
          toggleOn(effectStr);
        }
        else {
          instrument.connect(effect);
          ACTIVEFX[effect] = true;
          toggleOn(effectStr);
        }
        break;
      case "down":
        effect.wet.value -= 0.1;
        $(`.${effectStr}`)[0].value -= 10;
        break;
      case "up":
        effect.wet.value += 0.1;
        $(`.${effectStr}`)[0].value += 10;
        break;
    }
  }

  // change octaves on '+' and '-' keys //
  if (e.keyCode === 187 && octave < 6) { octave++ }
  else if (e.keyCode === 189 && octave > 1) { octave-- }
});

document.addEventListener('keyup', (e) => {
  if (KEYCODES.hasOwnProperty(e.keyCode)) {
    const note = KEYCODES[e.keyCode][0];
    const color = KEYCODES[e.keyCode][1];
    // turn off note //
    if (note[0] === 'e') {
      instrument.triggerRelease(`${note.slice(1)}${octave + 1}`);
      sustainClassToggle(`${note}`, `${color}`);
    }
    else {
      instrument.triggerRelease(`${note}${octave}`);
      sustainClassToggle(`${note}`, `${color}`);
    }
  }
  else if (FXCODES.hasOwnProperty(e.keyCode)) {
    let effect = FXCODES[e.keyCode][0];
    let change = FXCODES[e.keyCode][1];
    let effectStr = FXCODES[e.keyCode][2];

    if (effectStr === 'vibrato') {
      instrument.disconnect(effect);
      ACTIVEFX[effect] = false;
    }
  }
});
