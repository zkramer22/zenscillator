# Zenscillator

[Live Link!](https://zkramer22.github.io/zenscillator/)

## MVP
**Zenscillator** is an interactive sound synthesis & visualization app that allows users to make music with their computer keyboards and enjoy the responsive and colorful visual feedback.

### main features
1. Tone.js powered audio synthesizer, responds to computer keyboard presses and on-screen tweakable parameters.

2. On-screen piano keyboard, animates in response to keyboard presses.

3. Visualization events, created with Canvas that are triggered by sounds of certain frequencies

4. MIDI capability, allows for external USB MIDI controller to provide musical input with velocity and various MIDI channel controls.

------------------

## Technologies, Libraries, APIs
I will construct the audio portion of Zenscillator with the Tone.js library, which is a powerful extension of the HTML5 Web Audio API. The design and visualization will be done using vanilla JS and Canvas, along with CSS for extra styling and animations.

------------------
## Wireframes
- single black screen, with visualizer shapes / events appearing on audio input
- audio parameter controls are present when mouse is in top left corner
- piano on bottom of screen, animates when computer keyboard is pressed

------------------
## Implementation Timeline
#### :: Phase 1 ::
- get Tone library installed, up and running
- make app respond to computer keyboard key presses to emulate piano
- craft basic electric piano sound using filters / oscillators

#### :: Phase 2 ::
- allow for modulation / manipulation of sound parameters (compression, reverb, filter, panning)
- draw piano on screen, respond to keyboard keypresses

#### :: Phase 3 ::
- create canvas shapes that will render upon certain keypresses
- continue polishing visualization events, work on introducing MIDI capability if on track
