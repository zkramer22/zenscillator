import Tone from 'tone';
//////////////////////
// instrument setup //
//////////////////////

const INSTRUMENTS = {
  "synth"     : new Tone.PolySynth(16, Tone.Synth).toMaster(),
  "membrane"  : new Tone.PolySynth(2, Tone.MembraneSynth).toMaster(),
  "fm"        : new Tone.PolySynth(2, Tone.FMSynth).toMaster()
};

const KEYCODES = {
  90  : ['C', 'red', [255, 48, 48]],             // z
  83  : ['Db', 'redorange', [255, 106, 48]],      // s
  88  : ['D', 'orange', [255, 175, 48]],          // x
  68  : ['Eb', 'orangeyellow', [255, 217, 48]],   // d
  67  : ['E', 'yellow', [251, 255, 48]],          // c
  86  : ['F', 'green', [75, 255, 48]],           // v
  71  : ['Gb', 'teal', [48, 255, 185]],           // g
  66  : ['G', 'lightblue', [48, 255, 251]],       // b
  72  : ['Ab', 'blue', [48, 185, 255]],           // h
  78  : ['A', 'bluepurple', [48, 72, 255]],      // n
  74  : ['Bb', 'purple', [192, 48, 255]],         // j
  77  : ['B', 'magenta', [255, 48, 175]],         // m
  188 : ['eC', 'red', [255, 48, 48]],            // ,
  76  : ['eDb', 'redorange', [255, 106, 48]],     // l
  190 : ['eD', 'orange', [255, 175, 48]],         // .
  186 : ['eEb', 'orangeyellow', [255, 217, 48]],  // ;
  191 : ['eE', 'yellow', [251, 255, 48]]          // /
};

let instrument = INSTRUMENTS["synth"];
instrument.set({ oscillator: { type: "sine" } });
instrument.volume.value = -5;
let octave = 4;

//////////////////////
//// effects setup ///
//////////////////////

let tremolo = new Tone.Tremolo(
  { frequency: "8n", type: "sine", depth: 0.5, spread: 0 }
).toMaster().start();
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

/////////////////////
///// analysers /////
/////////////////////

const waveform = new Tone.Analyser("waveform", 2048);
instrument.connect(waveform);

const meter = new Tone.Meter(0.8);
instrument.connect(meter);

// let mic = new Tone.UserMedia();
// mic.connect(waveform);
// .toMaster();

// mic.open();

//////////////////////
//////  canvas  //////
//////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.canvas.width = $('#canvas').width();
  ctx.canvas.height = $('#canvas').height();
});

//----------------------------//

const drawLoop = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.canvas.width = $('#canvas').width();
  ctx.canvas.height = $('#canvas').height();
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  let values = waveform.getValue();
  let level = meter.getLevel();

  const req = requestAnimationFrame(drawLoop);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  if (level !== -Infinity && level < -80) {
    return;
  }

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.lineWidth = 6;
  // ctx.strokeStyle = 'rgb(' + window.colors[0] + ',' + window.colors[1] + ',' + window.colors[2] + ')';
  ctx.strokeStyle = 'rgb(' + window.r + ',' + window.g + ',' + window.b + ')';
  ctx.moveTo(0, (values[0] + 1) / 2 * canvasHeight);
  for (let i = 1, len = values.length; i < len; i++) {
    const val = (values[i] + 1) / 2;
    const x = canvasWidth * (i / (len - 1));
    const y = val * canvasHeight;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

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

const toggleInst = (inst, color) => {
  $('.instrument').attr('class', 'instrument');
  $(`#${inst}`).toggleClass(`${color}`);
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

document.addEventListener('click', (e) => {
  if (e.target.className === 'instrument') {
    const type = (e.target.id);
    switch (type) {
      case 'triangle':
        instrument = INSTRUMENTS["synth"];
        instrument.set({ oscillator: { type: "triangle" } });
        instrument.volume.value = 0;
        toggleInst(type, 'lightblue');
        octave = 4;
        break;
      case 'square':
        instrument = INSTRUMENTS["synth"];
        instrument.set({ oscillator: { type: "square" } });
        instrument.volume.value = -15;
        toggleInst(type, 'orangeyellow');
        octave = 4;
        break;
      case 'sine':
        instrument = INSTRUMENTS["synth"];
        instrument.set({ oscillator: { type: "sine" } });
        instrument.volume.value = -5;
        toggleInst(type, 'green');
        octave = 4;
        break;
      case 'membrane':
        instrument = INSTRUMENTS["membrane"];
        instrument.volume.value = -3;
        toggleInst(type, 'redorange');
        octave = 1;
        break;
      case 'fm':
        instrument = INSTRUMENTS["fm"];
        instrument.volume.value = 0;
        toggleInst(type, 'purple');
        octave = 2;
        break;
    }
  }
});

//////////////////////
/// keyboard events //
//////////////////////

document.addEventListener('keydown', (e) => {
  if (KEYCODES.hasOwnProperty(e.keyCode)) {
    if (e.repeat) { return null }

    // turn on note //
    const note = KEYCODES[e.keyCode][0];
    const color = KEYCODES[e.keyCode][1];
    const rgbs = KEYCODES[e.keyCode][2];

    window.r = rgbs[0];
    window.g = rgbs[1];
    window.b = rgbs[2];

    // if (window.colors === undefined) {
    //   window.colors = {
    //     0: [rgbs[0]],
    //     1: [rgbs[1]],
    //     2: [rgbs[2]]
    //   };
    // }
    // else if (window.colors !== undefined) {
    //   window.colors[0].push(rgbs[0]);
    //   window.colors[1].push(rgbs[1]);
    //   window.colors[2].push(rgbs[2]);
    // }

    switch (note[0]) {
      case "e":
        instrument.triggerAttack(`${note.slice(1)}${octave + 1}`);
        sustainClassToggle(`${note}`, `${color}`);
        drawLoop();
        break;
      default:
        instrument.triggerAttack(`${note}${octave}`);
        sustainClassToggle(`${note}`, `${color}`);
        drawLoop();
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
          effect.connect(waveform);
          effect.connect(meter);
          ACTIVEFX[effect] = true;
          toggleOn(effectStr);
        }
        break;
      case "down":
        effect.wet.value -= 0.1;
        $(`.${effectStr}`)[0].value -= 0.1;
        break;
      case "up":
        effect.wet.value += 0.1;
        $(`.${effectStr}`)[0].value += 0.1;
        break;
    }
  }
  else if (e.keyCode === 189 && octave > 1) { octave-- }
  else if (e.keyCode === 187 && octave < 6) { octave++ }

  // change octaves on '+' and '-' keys //
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

//
