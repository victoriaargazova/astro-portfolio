// public/js/navmenu.js

const navButton = document.querySelector('.nav__button');
const navList = document.querySelector('.nav__list');

if (!navButton || !navList) {
    // fail silently if markup changes
    // (you can log a warning here if you want, but not required)
} else {
    navButton.addEventListener('click', () => {
        navList.classList.toggle('nav--open');
    });
}



