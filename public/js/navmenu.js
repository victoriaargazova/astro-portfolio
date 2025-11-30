// public/js/navmenu.js

window.addEventListener('DOMContentLoaded', () => {
    console.log('navmenu.js loaded');

    const navButton = document.querySelector('.nav__button');
    const navList = document.querySelector('.nav__list');

    if (!navButton || !navList) {
        console.warn('Nav button or nav list not found');
        return; // prevents "classList of null" crashes
    }

    navButton.addEventListener('click', () => {
        navList.classList.toggle('nav--open');
    });
});



