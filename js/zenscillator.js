import Tone from 'tone';
import { waveform } from './analysers';
import { KEYCODES, KEYSTATES, MOUSECODES, MODKEYS } from './key-mouse';
import {
  INSTRUMENTS, switchInst, toggleInst, noteOn, noteOff, octaveUp, octaveDown,
  sustainClassToggle
} from './instruments';
import {
  tremolo, autopan, splash, delay, reverb, vibrato, compressor, limiter,
  FXBANK, FXCODES, ACTIVEFX, efxPaneToggle, effectToggle, vibratoToggle
} from './effects';
import {
  createGradient, drawLoopStraight, drawLoopCircle, DRAWERS, gradientHandler,
  drawerOn, drawerOff, visualsPaneToggle, visualToggle
} from './visualizers';

class Zenscillator {
  constructor() {
    this.instrument = INSTRUMENTS['sine'];
    this.octave = 4;

    this.drawLoop = DRAWERS['straight'];
    this.lineWidth = 3;
    this.circleSpeed = 69.1;
    this.radiusDenom = 4;

    this.efxPane = false;
    this.visualsPane = false;
  }

  chainItUp() {
    if (Zen.instrument === INSTRUMENTS['square']) {
      Zen.instrument.volume.value = -20;
    }
    else {
      Zen.instrument.volume.value = -5;
    }

    Zen.instrument.chain(
      tremolo, vibrato,
      autopan, splash, reverb, delay,
      compressor, limiter,
      waveform,
      Tone.Master
    );
  }
}

export const Zen = new Zenscillator();

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
  const $lineWidth = $('#lineWidth');
  const $lineWidthFill = $('#lineWidth-fill');
  const $circleSpeeds = $('.circleSpeed');

      Zen.chainItUp();

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
            Zen.instrument = INSTRUMENTS["triangle"];
            toggleInst(type, 'lightblue');
            Zen.octave = 4;
            break;
          case 'square':
            Zen.instrument = INSTRUMENTS["square"];
            toggleInst(type, 'orangeyellow');
            Zen.octave = 4;
            break;
          case 'sine':
            Zen.instrument = INSTRUMENTS["sine"];
            toggleInst(type, 'green');
            Zen.octave = 4;
            break;
          case 'membrane':
            Zen.instrument = INSTRUMENTS["membrane"];
            toggleInst(type, 'redorange');
            Zen.octave = 1;
            break;
          case 'fm':
            Zen.instrument = INSTRUMENTS["fm"];
            toggleInst(type, 'purple');
            Zen.octave = 2;
            break;
        }

        Zen.chainItUp();
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

      $lineWidth.mousedown(e => {
        const pageX = e.pageX;
        const offset = $(e.target).offset().left;
        const clickSpot = (pageX - offset) / 117;

        $lineWidthFill.width(clickSpot * 117);
        Zen.lineWidth = Math.round(clickSpot * 100) / 10;

        if (Zen.lineWidth < 1) {
          Zen.lineWidth = 1;
        }

        $lineWidth.mousemove(eMove => {
          const moveVal = eMove.target.value;
          $lineWidthFill.width(moveVal / 100 * 117);
          Zen.lineWidth = Math.round(moveVal) / 10;

          if (Zen.lineWidth < 1) {
            Zen.lineWidth = 1;
          }
        });

        $lineWidth.mouseup(eUp => {
          $lineWidth.off('mousemove');
        });

      });

      $circleSpeeds.click(e => {
        const $target = $(e.target);
        const num = $target.text();

        if (num === '2') {
          Zen.circleSpeed = 25.1;
        }
        else if (num === '3') {
          Zen.circleSpeed = 0.1;
        }
        else {
          Zen.circleSpeed = 69.1;
        }

        $circleSpeeds.removeClass('active');
        $target.addClass('active');
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
          let effectStr = FXCODES[keyDown][1];

          if (e.repeat) { return }

          effectToggle(effect, effectStr);
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
      $body.keypress(e => {
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
