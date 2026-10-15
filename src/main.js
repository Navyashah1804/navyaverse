import '@fontsource/press-start-2p/400.css';
import '@fontsource/pixelify-sans/400.css';
import '@fontsource/pixelify-sans/600.css';
import '@fontsource/pinyon-script/400.css';
import './styles/main.css';

import { gsap } from 'gsap';
import { Stage, tick } from './engine/stage.js';
import { homeScene } from './scenes/home.js';
import { flightScene } from './scenes/flight.js';
import { londonScene } from './scenes/london.js';
import { courtScene } from './scenes/court.js';
import { studyScene } from './scenes/study.js';
import { contactScene } from './scenes/contact.js';
import { smashScene, paperPlaneScene } from './scenes/transitions.js';
import { paintIcons } from './sprites/icons.js';
import { setupScroll } from './scroll.js';
import { setupUI } from './ui.js';
import { setupChat } from './chat/bubble.js';

const SCENES = {
  home: homeScene,
  flight: flightScene,
  london: londonScene,
  smash: smashScene,
  court: courtScene,
  paperplane: paperPlaneScene,
  study: studyScene,
  contact: contactScene,
};

// Visitors who ask their device for less motion get a still, fully readable page.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) document.documentElement.classList.add('static');

const stages = {};
document.querySelectorAll('.stage[data-scene]').forEach((el) => {
  stages[el.dataset.scene] = new Stage(el, SCENES[el.dataset.scene], { frozen: reduced });
});
gsap.ticker.add(() => tick(gsap.ticker.time));

paintIcons();
setupUI(stages, { reduced });
setupChat(stages.home);
setupScroll(stages, { reduced });
