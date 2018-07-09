import { KEYSTATES } from './key-mouse';
import { waveform } from './analysers';
import { Zen } from './zenscillator';

// add incoming hex value to window array, max 4 values
export const gradientHandler = hex => {
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

// set canvas stroke color to a gradient, using the window array of hex values
export const createGradient = (ctx, canvasWidth, canvasHeight) => {
  const ctxGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  window.gradient.forEach((hex, i) => {
    ctxGradient.addColorStop(String(Math.abs(i / window.gradient.length)), hex);
  });
  ctx.strokeStyle = ctxGradient;
};

// canvas draw function, uses analyser and paints waveform from left to right
export const drawLoopStraight = lineWidth => {
  const $canvas = $('#canvas');
  const ctx = $canvas[0].getContext("2d");
  ctx.canvas.width = $canvas.width();
  ctx.canvas.height = $canvas.height();
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  let values = waveform.getValue();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  createGradient(ctx, canvasWidth, canvasHeight);

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;

  ctx.moveTo(0, (values[0] + 1) / 2 * canvasHeight);
  for (let i = 1, len = values.length; i < len; i += 1) {
    const val = (values[i] + 1) / 2;
    const x = canvasWidth * (i / (len - 1));  // width of canvas multiplied by current percent progress through the 'values' array.
    const y = val * canvasHeight;             // height of canvas multiplied by 1.x / 2
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// canvas draw function, uses analyser and paints waveform along circular path
export const drawLoopCircle = (lineWidth, circleSpeed) => {
  const $canvas = $('#canvas');
  const ctx = $canvas[0].getContext("2d");
  ctx.canvas.width = $canvas.width();
  ctx.canvas.height = $canvas.height();
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  let values = waveform.getValue();

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

// activate the drawLoop function
export const drawerOn = () => {
  if (window.timeout) { clearTimeout(window.timeout) }

  if (!window.drawer) {
    window.drawer = window.setInterval(() => {
      Zen.drawLoop(Zen.lineWidth, Zen.circleSpeed), 1
    });
  }
  else {
    clearInterval(window.drawer);
    window.drawer = window.setInterval(() => {
      Zen.drawLoop(Zen.lineWidth, Zen.circleSpeed), 1
    });
  }
};

/*  deactivate the drawLoop function after a few seconds of inactivity.
    modifier only used in mouseup event listener  */
export const drawerOff = modifier => {
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

// object for storing draw functions, to be used when changing the drawLoop value
export const DRAWERS = {
  'straight': drawLoopStraight,
  'circle': drawLoopCircle
};

// change the drawLoop function
export const visualToggle = visualStr => {
  Zen.drawLoop = DRAWERS[visualStr];
  $('.visualsButton').removeClass('active');
  $(`#${visualStr}`).addClass('active');
};

// show and hide the visualsContainer
export const visualsPaneToggle = $visualsContainer => {
  const val = Zen.visualsPane ? '-100px' : '0px';
  Zen.visualsPane = !Zen.visualsPane;

  $visualsContainer.animate({ bottom: `${val}`}, 350);
};
