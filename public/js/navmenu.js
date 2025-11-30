const nav = document.querySelector(".nav");
const navButton = document.querySelector(".nav__button");
const navList = document.querySelector(".nav__list");
const navIcon = document.querySelector(".nav__icon");

navButton.addEventListener("click", () => {
    const expanded = navButton.getAttribute("aria-expanded") === "true";

    navButton.setAttribute("aria-expanded", !expanded);

    if (!expanded) {
        navList.classList.add("nav--open");
        navIcon.src = "/astro-portfolio/icons/navicon.svg";
    } else {
        navList.classList.remove("nav--open");
        navIcon.src = "/astro-portfolio/icons/navicon.svg";
    }
});


