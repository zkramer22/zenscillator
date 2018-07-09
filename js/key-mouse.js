// keyboard keys linked to piano notes and colors
export const KEYCODES = {
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

// keyboard key states - are the piano notes held down or not?
export const KEYSTATES = {
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
};

// modifier key states
export const MODKEYS = {
  'Meta': false, // MAC: command, WIN: windows
  'Alt': false,
  'Shift': false,
  ' ': false
};

// same as KEYCODES, except found by e.target.id when clicking on piano keys.
export const MOUSECODES = {
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
};
