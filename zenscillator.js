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
  90  : ['C', 'red', '#ff3030'],             // z
  83  : ['Db', 'redorange', '#ff6a30'],      // s
  88  : ['D', 'orange', '#ffaf30'],          // x
  68  : ['Eb', 'orangeyellow', '#ffd930'],   // d
  67  : ['E', 'yellow', '#fbff30'],          // c
  86  : ['F', 'green', '#4bff30'],           // v
  71  : ['Gb', 'teal', '#30ffb9'],           // g
  66  : ['G', 'lightblue', '#30fffb'],       // b
  72  : ['Ab', 'blue', '#30b9ff'],           // h
  78  : ['A', 'bluepurple', '#3048ff'],      // n
  74  : ['Bb', 'purple', '#c030ff'],         // j
  77  : ['B', 'magenta', '#ff30af'],         // m
  188 : ['eC', 'red', '#ff3030'],            // ,
  76  : ['eDb', 'redorange', '#ff6a30'],     // l
  190 : ['eD', 'orange', '#ffaf30'],         // .
  186 : ['eEb', 'orangeyellow', '#ffd930'],  // ;
  191 : ['eE', 'yellow', '#fbff30']          // /
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

const waveform = new Tone.Analyser("waveform", 4096);
instrument.connect(waveform);

// ##### meter analyser ##### //
// const meter = new Tone.Meter(0.8);
// instrument.connect(meter);

// ####### mic ######## //
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

// const drawLoop = () => {
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   ctx.canvas.width = $('#canvas').width();
//   ctx.canvas.height = $('#canvas').height();
//   const canvasWidth = ctx.canvas.width;
//   const canvasHeight = ctx.canvas.height;
//   let values = waveform.getValue();
//   let level = meter.getLevel();
//
//   const req = requestAnimationFrame(drawLoop);
//   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//
//   var ctxGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
//   window.gradient.forEach((hex, i) => {
//     ctxGradient.addColorStop(String(Math.abs(i / window.gradient.length)), hex);
//   });
//   ctx.strokeStyle = ctxGradient;
//
//   ctx.beginPath();
//   ctx.lineJoin = "round";
//   ctx.lineWidth = 6;
//
//   ctx.moveTo(0, (values[0] + 1) / 2 * canvasHeight);
//   for (let i = 1, len = values.length; i < len; i++) {
//     const val = (values[i] + 1) / 2;
//     const x = canvasWidth * (i / (len - 1));
//     const y = val * canvasHeight;
//     ctx.lineTo(x, y);
//   }
//   ctx.stroke();
//
//   if (level !== -Infinity && level < -55) {
//     ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//     window.gradient = [];
//     // cancelAnimationFrame(req);
//     return;
//   }
// };

function drawLoop() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.canvas.width = $('#canvas').width();
  ctx.canvas.height = $('#canvas').height();
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  let values = waveform.getValue();
  // let level = meter.getLevel();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  var ctxGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  window.gradient.forEach((hex, i) => {
    ctxGradient.addColorStop(String(Math.abs(i / window.gradient.length)), hex);
  });
  ctx.strokeStyle = ctxGradient;

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.lineWidth = 6;

  ctx.moveTo(0, (values[0] + 1) / 2 * canvasHeight);
  for (let i = 1, len = values.length; i < len; i++) {
    const val = (values[i] + 1) / 2;
    const x = canvasWidth * (i / (len - 1));
    const y = val * canvasHeight;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // setTimeout(() => {
  //   if (level !== -Infinity && level < -70) {
  //     debugger
  //     window.clearInterval(window.drawer);
  //     ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  //     window.gradient = [];
  //   }
  // }, 150);
}

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
        instrument.volume.value = -10;
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
        instrument.connect(waveform);
        // instrument.connect(meter);
        instrument.volume.value = -3;
        toggleInst(type, 'redorange');
        octave = 1;
        break;
      case 'fm':
        instrument = INSTRUMENTS["fm"];
        instrument.connect(waveform);
        // instrument.connect(meter);
        instrument.volume.value = 0;
        toggleInst(type, 'purple');
        octave = 2;
        break;
    }
  } else if (e.target.id === 'mute') {
      if (e.target.innerHTML === 'volume_up') {
        e.target.innerHTML = 'volume_off';
        Tone.Master.mute = true;
      }
      else {
        e.target.innerHTML = 'volume_up';
        Tone.Master.mute = false;
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
    const hex = KEYCODES[e.keyCode][2];
    window.hexOn = hex;

    if (window.gradient) {
      if (window.gradient.length === 4) { window.gradient.pop() }
      window.gradient.unshift(hexOn);
    }
    else {
      window.gradient = [hexOn];
    }

    switch (note[0]) {
      case "e":
        instrument.triggerAttack(`${note.slice(1)}${octave + 1}`);
        sustainClassToggle(`${note}`, `${color}`);
        window.drawer = window.setInterval(drawLoop, 10);
        break;
      default:
        instrument.triggerAttack(`${note}${octave}`);
        sustainClassToggle(`${note}`, `${color}`);
        window.drawer = window.setInterval(drawLoop, 10);
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
          // effect.connect(meter);
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
    const hex = KEYCODES[e.keyCode][2];

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
//