const navButton = document.querySelector(".nav__button");
const navList = document.querySelector(".nav__list");
const navIcon = document.querySelector(".nav__icon");

navButton.addEventListener("click", () => {
    const expanded = navButton.getAttribute("aria-expanded") === "true";

    navButton.setAttribute("aria-expanded", String(!expanded));

    if (!expanded) {
        navList.classList.add("nav--open");
        navIcon.src = "/icons/close.svg";
    } else {
        navList.classList.remove("nav--open");
        navIcon.src = "/icons/navicon.svg";
    }
});


