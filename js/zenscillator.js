import Tone from 'tone';

//////////////////////
// instrument setup //
//////////////////////

const INSTRUMENTS = {
  "synth"     : new Tone.PolySynth(16, Tone.Synth),
  "membrane"  : new Tone.PolySynth(2, Tone.MembraneSynth),
  "fm"        : new Tone.PolySynth(2, Tone.FMSynth)
};

const KEYCODES = {
  'z'  : ['C', 'red', '#ff3030'],
  's'  : ['Db', 'redorange', '#ff6a30'],
  'x'  : ['D', 'orange', '#ffaf30'],
  'd'  : ['Eb', 'orangeyellow', '#ffd930'],
  'c'  : ['E', 'yellow', '#fbff30'],
  'v'  : ['F', 'green', '#4bff30'],
  'g'  : ['Gb', 'teal', '#30ffb9'],
  'b'  : ['G', 'lightblue', '#30fffb'],
  'h'  : ['Ab', 'blue', '#30b9ff'],
  'n'  : ['A', 'bluepurple', '#3048ff'],
  'j'  : ['Bb', 'purple', '#c030ff'],
  'm'  : ['B', 'magenta', '#ff30af'],
  ','  : ['eC', 'red', '#ff3030'],
  'l'  : ['eDb', 'redorange', '#ff6a30'],
  '.'  : ['eD', 'orange', '#ffaf30'],
  ';'  : ['eEb', 'orangeyellow', '#ffd930'],
  '/'  : ['eE', 'yellow', '#fbff30']
};

const KEYSTATES = {
  'z'  : false,
  's'  : false,
  'x'  : false,
  'd'  : false,
  'c'  : false,
  'v'  : false,
  'g'  : false,
  'b'  : false,
  'h'  : false,
  'n'  : false,
  'j'  : false,
  'm'  : false,
  ','  : false,
  'l'  : false,
  '.'  : false,
  ';'  : false,
  '/'  : false
}

const MOUSECODES = {
  'C': ['red', '#ff3030'],
  'Db': ['redorange', '#ff6a30'],
  'D': ['orange', '#ffaf30'],
  'Eb': ['orangeyellow', '#ffd930'],
  'E': ['yellow', '#fbff30'],
  'F': ['green', '#4bff30'],
  'Gb': ['teal', '#30ffb9'],
  'G': ['lightblue', '#30fffb'],
  'Ab': ['blue', '#30b9ff'],
  'A': ['bluepurple', '#3048ff'],
  'Bb': ['purple', '#c030ff'],
  'B': ['magenta', '#ff30af'],
  'eC': ['red', '#ff3030'],
  'eDb': ['redorange', '#ff6a30'],
  'eD': ['orange', '#ffaf30'],
  'eEb': ['orangeyellow', '#ffd930'],
  'eE': ['yellow', '#fbff30']
}

const MODKEYS = {
  'Meta': false, // MAC: command, WIN: windows
  'Alt': false,
  'Shift': false,
  ' ': false
}

let instrument = INSTRUMENTS["synth"];
instrument.set({ oscillator: { type: "sine" } });
instrument.volume.value = -5;
let octave = 4;

//////////////////////
//// effects setup ///
//////////////////////

let tremolo = new Tone.Tremolo(
  { frequency: "8n", type: "sine", depth: 1, spread: 0, wet: 0 }
).start();
let autopan = new Tone.AutoPanner(
  { frequency: "4n", depth: 1, wet: 0 }
).start();
let splash = new Tone.JCReverb(
  { roomSize: 0.8, wet: 0 }
);
let delay = new Tone.PingPongDelay(
  { delayTime: "4n", feedback: 0.2, wet: 0 }
);
let reverb = new Tone.Freeverb(
  { roomSize: 0.88, dampening: 2000, wet: 0 }
);
let vibrato = new Tone.Vibrato(
  { frequency: 8, depth: 0.2, wet: 0 }
);
let compressor = new Tone.Compressor(-24, 20);
let limiter = new Tone.Limiter(-15);
let efxPane = false;

// TODO:  add pitch bend! could be up and down arrow keys

const FXBANK = {
  "tremolo": [tremolo, 0.6],
  "autopan": [autopan, 0.6],
  "splash": [splash, 0.6],
  "delay": [delay, 0.6],
  "reverb": [reverb, 0.6],
  "vibrato": [vibrato, 0.6],
};

const FXCODES = {
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
  // '`' : [vibrato, "toggle", "vibrato"]
};

const ACTIVEFX = {
  'tremolo' : false,
  'autopan' : false,
  'splash'  : false,
  'delay'   : false,
  'reverb'  : false,
  'vibrato' : false
};

/////////////////////
///// analysers /////
/////////////////////

const waveform = new Tone.Analyser("waveform", 2048); // TODO: change to 2048
waveform.smoothing = 1;

// ##### meter analyser ##### //
// const meter = new Tone.Meter(0.8);
// instrument.connect(meter);

// ####### mic ######## //
// let mic = new Tone.UserMedia();
// mic.connect(waveform);
// .toMaster();
// mic.open();


///////////////////////////////////////////////////////////////////
// connect instrument to effects, analysers, and master output. ///
///////////////////////////////////////////////////////////////////
const chainItUp = () => {
  instrument.chain(
    tremolo, vibrato,
    autopan, splash, reverb, delay,
    compressor, limiter,
    waveform,
    Tone.Master
  );
}

const createGradient = (ctx, canvasWidth, canvasHeight) => {
  const ctxGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  window.gradient.forEach((hex, i) => {
    ctxGradient.addColorStop(String(Math.abs(i / window.gradient.length)), hex);
  });
  ctx.strokeStyle = ctxGradient;
};


/////////////////////////////////////////////////////
//// drawing functions, takes waveform analyser /////
////  data and draws strokes on canvas element //////
/////////////////////////////////////////////////////
const drawLoopStraight = () => {
  const $canvas = $('#canvas');
  const ctx = $canvas[0].getContext("2d");
  ctx.canvas.width = $canvas.width();
  ctx.canvas.height = $canvas.height();
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  let values = waveform.getValue();
  // let level = meter.getLevel();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  createGradient(ctx, canvasWidth, canvasHeight);

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.lineWidth = 5;

  ctx.moveTo(0, (values[0] + 1) / 2 * canvasHeight);
  for (let i = 1, len = values.length; i < len; i += 1) {
    const val = (values[i] + 1) / 2;
    const x = canvasWidth * (i / (len - 1));  // width of canvas multiplied by current percent progress through the 'values' array.
    const y = val * canvasHeight;             // height of canvas multiplied by 1.x / 2
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

const drawLoopCircle = () => {
  const $canvas = $('#canvas');
  const ctx = $canvas[0].getContext("2d");
  ctx.canvas.width = $canvas.width();
  ctx.canvas.height = $canvas.height();
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  let values = waveform.getValue();
  // let level = meter.getLevel();

  createGradient(ctx, canvasWidth, canvasHeight);

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const radius = canvasHeight / 4;

  for (let i = 1, angle = 0, len = values.length; i < len; i += 1, angle += circleSpeed) {
    const val = (values[i] + 1);
    const x = centerX + Math.cos(angle) * radius * val;
    const y = centerY + Math.sin(angle) * radius * val;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

const DRAWERS = {
  'straight': drawLoopStraight,
  'circle': drawLoopCircle
};

let circleSpeed = 0.1;
let lineWidth = 3;
let drawLoop = DRAWERS['straight'];
let visualsPane = false;
//////////////////////
///// DOM manip //////
//////////////////////

// light up keyboard notes
const sustainClassToggle = (note, color) => {
  $(`#${note}`).toggleClass(`${color}`).toggleClass('keydown');
};

const toggleOn = string => {
  $(`#${string}`).toggleClass('active');
};

const toggleInst = (inst, color) => {
  $('.instrument').attr('class', 'instrument');
  $(`#${inst}`).toggleClass(`${color} current`);
};

const switchInst = direction => {
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

const effectToggle = (effect, effectStr) => {
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
  toggleOn(effectStr);
};

const visualToggle = visualStr => {
  drawLoop = DRAWERS[visualStr];
  $('.visualsButton').removeClass('active');
  $(`#${visualStr}`).addClass('active');
};

const vibratoToggle = ($vibrato, $vibratoKey) => {
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

const octaveUp = ($octave, $octaveUp) => {
  if (octave < 6) {
    octave++;
    $octave.toggleClass('active');
    $octaveUp.toggleClass('keydown');
    setTimeout(() => {
      $octave.toggleClass('active');
      $octaveUp.toggleClass('keydown');
    }, 120);
  }
};

const octaveDown = ($octave, $octaveDown) => {
  if (octave > 1) {
    octave--;
    $octave.toggleClass('active');
    $octaveDown.toggleClass('keydown');
    setTimeout(() => {
      $octave.toggleClass('active');
      $octaveDown.toggleClass('keydown');
    }, 120);
  }
};

const efxPaneToggle = $efxContainer => {
  const val = efxPane ? '-205px' : '0px';
  efxPane = !efxPane;

  $efxContainer.animate({ bottom: `${val}`}, 350);
};

const visualsPaneToggle = $visualsContainer => {
  const val = visualsPane ? '-100px' : '0px';
  visualsPane = !visualsPane;

  $visualsContainer.animate({ bottom: `${val}`}, 350);
};

const gradientHandler = hex => {
  window.hexOn = hex;

  if (window.gradient) {
    if (window.gradient.length === 4) {
      window.gradient.pop();
    }
    window.gradient.unshift(hexOn);
  }
  else {
    window.gradient = [hexOn];
  }
};

const noteOn = note => {
  if (note[0] !== "e") {
    instrument.triggerAttack(`${note}${octave}`);
  }
  else {
    instrument.triggerAttack(`${note.slice(1)}${octave + 1}`);
  }
};

const noteOff = noteUp => {
  if (noteUp[0] !== 'e') {
    instrument.triggerRelease(`${noteUp}${octave}`);
  }
  else {
    instrument.triggerRelease(`${noteUp.slice(1)}${octave + 1}`);
  }
};

const drawerOn = () => {
  if (window.timeout) { clearTimeout(window.timeout) }

  if (!window.drawer) {
    window.drawer = window.setInterval(drawLoop, 1);
  }
  else {
    clearInterval(window.drawer);
    window.drawer = window.setInterval(drawLoop, 1);
  }
};

const drawerOff = modifier => {
  if (window.timeout) { clearTimeout(window.timeout) }

  if (modifier) {
    if (Object.values(KEYSTATES).every(el => { return el === false })) {
      window.timeout = setTimeout(() => {
          clearInterval(window.drawer);
      }, 3750);
    }
  }
  else {
    window.timeout = setTimeout(() => {
      clearInterval(window.drawer);
    }, 3750);
  }
};


//////////////////////
//// touch events ////
//////////////////////
//
// TODO: fix these, use helper functions like in mouse and keyboard events. Check how it interacts with jQuery.
document.addEventListener('touchstart', (e) => {
  // e.preventDefault();

  if (e.target.className === 'natural' || e.target.className === 'flat') {
    const note = e.target.id;
    const color = MOUSECODES[e.target.id][0];
    const hex = MOUSECODES[e.target.id][1];

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
});

document.addEventListener('touchend', (e) => {
  // e.preventDefault();

  if (MOUSECODES.hasOwnProperty(e.target.id)) {
    const note = e.target.id;
    const color = MOUSECODES[e.target.id][0];
    const hex = MOUSECODES[e.target.id][1];

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
});

///////////////////////
/// event listeners ///
///////////////////////

$(document).ready(() => {
  const $keys = $('.naturals-group, .flats-group');
  const $body = $('body');
  const $instruments = $('.instrument');
  const $mute = $('#mute');
  const $help = $('#ok-button, #help');
  const $vibrato = $('#vibrato');
  const $vibratoKey = $('.vibrato');
  const $octave = $('#octave');
  const $octaveUp = $('#octaveUp');
  const $octaveDown = $('#octaveDown');
  const $efxPane = $('#efxPane');
  const $efxContainer = $('#efxContainer');
  const $efxButtons = $('.efxButton');
  const $visualsPane = $('#visualsPane');
  const $visualsContainer = $('#visualsContainer');
  const $visualsButtons = $('.visualsButton');

      chainItUp();

      $body.contextmenu(e => e.preventDefault());

      $('#instructions-container').fadeIn(1000); 

      // click to play notes. Mouseup and mousemove events inside.
      $keys.mousedown(e => {
        e.preventDefault();

        const note = e.target.id;
        const color = MOUSECODES[note][0];
        const hex = MOUSECODES[note][1];
        const $target = $(e.target);

        gradientHandler(hex);
        noteOn(note);
        sustainClassToggle(`${note}`, `${color}`);
        drawerOn();

        $keys.mouseup(eKeyup => {

          eKeyup.preventDefault();

          const noteUp = eKeyup.target.id;
          const colorUp = MOUSECODES[noteUp][0];

          noteOff(noteUp);
          sustainClassToggle(`${noteUp}`, `${colorUp}`);
          drawerOff();

          $keys.off('mousemove mouseup');
          $body.off('mouseup');

        });

        $keys.mousemove(eMove => {
            if (eMove.target.id !== note) {
              $target.trigger('mouseup');
              $(eMove.target).trigger('mousedown');
            }
        });

        $body.mouseup(eUp => {
          if (eUp.target.className === 'natural' || eUp.target.className === 'flat') {
            return;
          }
          else {
            $target.trigger('mouseup');
          }
        });

      });

      $instruments.click(e => {
        const type = (e.target.id);

        switch (type) {
          case 'triangle':
            instrument = INSTRUMENTS["synth"];
            instrument.set({ oscillator: { type: "triangle" } });
            instrument.volume.rampTo(-5, .1);
            toggleInst(type, 'lightblue');
            octave = 4;
            break;
          case 'square':
            instrument = INSTRUMENTS["synth"];
            instrument.set({ oscillator: { type: "square" } });
            instrument.volume.rampTo(-10, 0.1);
            toggleInst(type, 'orangeyellow');
            octave = 4;
            break;
          case 'sine':
            instrument = INSTRUMENTS["synth"];
            instrument.set({ oscillator: { type: "sine" } });
            instrument.volume.rampTo(-5, .1);
            toggleInst(type, 'green');
            octave = 4;
            break;
          case 'membrane':
            instrument = INSTRUMENTS["membrane"];
            instrument.volume.rampTo(-3, .1);
            toggleInst(type, 'redorange');
            octave = 1;
            break;
          case 'fm':
            instrument = INSTRUMENTS["fm"];
            instrument.volume.rampTo(0, .1);
            toggleInst(type, 'purple');
            octave = 2;
            break;
        }

        chainItUp();
      });

      $mute.click(e => {
        let status = e.target.innerHTML;
        if (status === 'volume_up') {
          e.target.innerHTML = 'volume_off';
          Tone.Master.volume.rampTo(-Infinity, .1)
        }
        else {
          e.target.innerHTML = 'volume_up';
          Tone.Master.volume.rampTo(0, .1);
        }
      });

      $help.click(e => {
        const $instructions = $('#instructions-container');

        if ($instructions.is(':hidden')) {
          $instructions.fadeIn(100);
        }
        else {
          $instructions.fadeOut(100);
        }

        if (Tone.context.state !== 'running') { Tone.context.resume() }

      });

      $octaveUp.click(e => {
        octaveUp($octave, $octaveUp);
      });

      $octaveDown.click(e => {
        octaveDown($octave, $octaveDown);
      });

      $vibratoKey.click(e => {
        vibratoToggle($vibrato, $vibratoKey);
      });

      $efxPane.click(e => {
        efxPaneToggle($efxContainer);
      });

      $efxButtons.click(e => {
        const effectStr = e.target.id;
        const effect = FXBANK[effectStr][0];
        effectToggle(effect, effectStr);
      });

      $visualsPane.click(e => {
        visualsPaneToggle($visualsContainer);
      });

      $visualsButtons.click(e => {
        const visualStr = e.target.id;
        visualToggle(visualStr);
      });

      // separate keydown listener for changing instrument with arrow keys.
      $body.keydown(e => {
        if (Tone.context.state !== 'running') { return }

        const keyDown = e.key;

        if (keyDown === 'ArrowLeft') {
          e.preventDefault();
          switchInst('prev');
        }
        else if (keyDown === 'ArrowRight') {
          e.preventDefault();
          switchInst('next');
        }
      });

      // press keyboard keys to play notes.
      document.addEventListener('keydown', e => {
        if (Tone.context.state !== 'running') { return }

        if (e.metaKey) {
          MODKEYS['Meta'] = true;
          return;
        }

        const keyDown = e.key;

        if (MODKEYS.hasOwnProperty(keyDown)) {
          MODKEYS[keyDown] = true
        }
        else if (KEYCODES.hasOwnProperty(keyDown)) {
            if (e.repeat) { return }

            // turn on note //
            const note = KEYCODES[keyDown][0];
            const color = KEYCODES[keyDown][1];
            const hex = KEYCODES[keyDown][2];

            if (MODKEYS[' '] && KEYSTATES[keyDown]) {
              setTimeout(() => {
                sustainClassToggle(`${note}`, `${color}`);
              }, 30)
            }

            KEYSTATES[keyDown] = true;

            gradientHandler(hex);
            noteOn(note);
            sustainClassToggle(`${note}`, `${color}`);
            drawerOn();
        }
        else if (FXCODES.hasOwnProperty(keyDown)) {
          let effect = FXCODES[keyDown][0];
          let change = FXCODES[keyDown][1];
          let effectStr = FXCODES[keyDown][2];

          if (e.repeat) { return }

          switch (change) {
            case "toggle":
              effectToggle(effect, effectStr);
              break;
            case "down":
              if (!ACTIVEFX[effect]) {
                return;
              }
              else {
                effect.wet.rampTo(effect.wet.value - 0.2, .1);
                $(`.${effectStr}`)[0].value -= 0.2;
                FXBANK[effectStr][1] = effect.wet.value;
              }
              break;
            case "up":
              if (!ACTIVEFX[effect]) {
                return;
              }
              else {
                effect.wet.rampTo(effect.wet.value + 0.2, .1);
                $(`.${effectStr}`)[0].value += 0.2;
                FXBANK[effectStr][1] = effect.wet.value;
              }
              break;
          }
        }
        else if (keyDown === 'Control') { // show & hide efx panel
          efxPaneToggle($efxContainer);
        }
      });

      document.addEventListener('keyup', e => {
        if (Tone.context.state !== 'running') { return }

        const keyUp = e.key;

        if (!MODKEYS[' '] && MODKEYS[keyUp]) {
          MODKEYS[keyUp] = false;
          Object.keys(KEYSTATES).forEach(el => {
            if (KEYSTATES[el]) {
              document.dispatchEvent(new KeyboardEvent('keyup',{ 'key': el }));
            }
          });
          return;
        }
        else if (KEYCODES.hasOwnProperty(keyUp)) {
          if (MODKEYS[' ']) { return }

          KEYSTATES[keyUp] = false;

          const noteUp = KEYCODES[keyUp][0];
          const colorUp = KEYCODES[keyUp][1];
          const $note = $(`#${noteUp}`);

          if (!$note.hasClass('keydown')) { return }

          noteOff(noteUp);
          sustainClassToggle(`${noteUp}`, `${colorUp}`);
          drawerOff(1);
        }
        else if (keyUp === ' ') {
          if (Object.values(KEYSTATES).some(el => { return el === true })) {
            MODKEYS[' '] = false;
            Object.keys(KEYSTATES).forEach(el => {
              if (KEYSTATES[el]) {
                document.dispatchEvent(new KeyboardEvent('keyup',{ 'key': el }));
              }
            });
          }
          else {
            MODKEYS[' '] = false;
          }
        }

      });

      // extra keys: octave switch, vibrato toggle
      document.addEventListener('keypress', e => {
        const keyPress = e.key;
        switch (keyPress) {
          case '=':
            octaveUp($octave, $octaveUp);
            break;
          case '-':
            octaveDown($octave, $octaveDown);
            break;
          case '`':
            vibratoToggle($vibrato, $vibratoKey);
            break;
          default:
            return;
        }
      });
});
