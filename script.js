/* =========================
   PORTFOLIO INTERACTIONS
   ========================= */

"use strict";


/* =========================
   AUTOMATIC FOOTER YEAR
   ========================= */

const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================
   NAVIGATION ON SCROLL
   ========================= */

const header = document.querySelector("header");

function updateHeader() {
    if (!header) {
        return;
    }

    header.classList.toggle("header-scrolled", window.scrollY > 20);
}

updateHeader();

window.addEventListener("scroll", updateHeader, {
    passive: true
});


/* =========================
   SECTION REVEAL
   ========================= */

const animatedElements = document.querySelectorAll(
    "#about > *, #projects > *, #skills > *, #experience > *, #contact > *"
);

animatedElements.forEach((element) => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
    }
);

animatedElements.forEach((element) => {
    revealObserver.observe(element);
});


/* =========================
   ACTIVE NAVIGATION LINK
   ========================= */

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll('nav ul a[href^="#"]');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const activeSectionId = entry.target.id;

            navigationLinks.forEach((link) => {
                const linkTarget = link.getAttribute("href");

                link.classList.toggle(
                    "active",
                    linkTarget === `#${activeSectionId}`
                );
            });
        });
    },
    {
        threshold: 0.35,
        rootMargin: "-20% 0px -45% 0px"
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});


/* =========================
   SMOOTH ANCHOR NAVIGATION
   ========================= */

const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const targetElement = document.querySelector(targetId);

        if (!targetElement) {
            return;
        }

        event.preventDefault();

        targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});