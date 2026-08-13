import { initVideoPlayer } from './modules/videoPlayer.js';
import { initNavigation } from './modules/navigation.js';
import { initScrollReveal } from './modules/scrollReveal.js';
import { initContactForm } from './modules/contactForm.js';
import { initBorderGlow } from './modules/borderGlow.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todos os módulos da aplicação
    initVideoPlayer();
    initNavigation();
    initScrollReveal();
    initContactForm();
    initBorderGlow();
});
