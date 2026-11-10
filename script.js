"use strict";


/* =========================================================
   GENERAL ELEMENTS
   ========================================================= */

const root = document.documentElement;
const header = document.querySelector("header");

const progressBar = document.querySelector(
    ".scroll-progress__bar"
);

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

const hero = document.querySelector("#home");
const heroTitle = document.querySelector("#home h1");

const currentYear = document.querySelector("#current-year");

const navigationLinks = document.querySelectorAll(
    'nav ul a[href^="#"]'
);

const sections = document.querySelectorAll(
    "main section[id]"
);

const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
);

const projectCards = document.querySelectorAll(
    "#projects article"
);

const revealElements = document.querySelectorAll(
    "#about > *, " +
    "#projects > *, " +
    "#skills > *, " +
    "#experience > *, " +
    "#contact > *"
);

const interactiveElements = document.querySelectorAll(
    "a, button, #projects article, #experience article, .cad-visual"
);

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const precisePointer = window.matchMedia(
    "(pointer: fine)"
).matches;


/* =========================================================
   YEAR
   ========================================================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   HERO TITLE
   ========================================================= */

if (heroTitle) {
    const text = heroTitle.textContent
        .replace(/\s+/g, " ")
        .trim();

    heroTitle.textContent = "";

    const inner = document.createElement("span");

    inner.className = "hero-title-inner";
    inner.textContent = text;

    heroTitle.appendChild(inner);
}


/* =========================================================
   SCROLL INTERFACE
   ========================================================= */

let scrollFrame = null;

function updateScrollInterface() {
    const scrollableHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        scrollableHeight > 0
            ? Math.min(window.scrollY / scrollableHeight, 1)
            : 0;

    if (progressBar) {
        progressBar.style.transform =
            `scaleY(${progress})`;
    }

    if (header) {
        header.classList.toggle(
            "header-scrolled",
            window.scrollY > 30
        );
    }

    scrollFrame = null;
}


function requestScrollUpdate() {
    if (scrollFrame !== null) {
        return;
    }

    scrollFrame = requestAnimationFrame(
        updateScrollInterface
    );
}


updateScrollInterface();

window.addEventListener(
    "scroll",
    requestScrollUpdate,
    { passive: true }
);

window.addEventListener(
    "resize",
    requestScrollUpdate,
    { passive: true }
);


/* =========================================================
   REVEAL ON SCROLL
   ========================================================= */

revealElements.forEach((element) => {
    element.classList.add("reveal");
});


projectCards.forEach((card, index) => {
    card.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 100, 300)}ms`
    );
});


if (
    "IntersectionObserver" in window &&
    !reducedMotion
) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add(
                    "reveal-visible"
                );

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("reveal-visible");
    });
}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (a, b) =>
                        b.intersectionRatio -
                        a.intersectionRatio
                )[0];

            if (!visible) {
                return;
            }

            navigationLinks.forEach((link) => {
                const active =
                    link.getAttribute("href") ===
                    `#${visible.target.id}`;

                link.classList.toggle("active", active);

                if (active) {
                    link.setAttribute(
                        "aria-current",
                        "page"
                    );
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        },
        {
            threshold: [0.2, 0.4, 0.6],
            rootMargin: "-18% 0px -48% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


/* =========================================================
   INTERNAL LINKS
   ========================================================= */

internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const selector = link.getAttribute("href");

        if (!selector || selector === "#") {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(selector);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "start"
        });
    });
});


/* =========================================================
   CUSTOM CURSOR
   ========================================================= */

if (
    precisePointer &&
    !reducedMotion &&
    cursorDot &&
    cursorRing
) {
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    let ringX = pointerX;
    let ringY = pointerY;


    window.addEventListener(
        "pointermove",
        (event) => {
            pointerX = event.clientX;
            pointerY = event.clientY;

            cursorDot.style.transform =
                `translate3d(${pointerX}px, ${pointerY}px, 0)`;
        },
        { passive: true }
    );


    function animateCursor() {
        ringX += (pointerX - ringX) * 0.14;
        ringY += (pointerY - ringY) * 0.14;

        cursorRing.style.transform =
            `translate3d(${ringX}px, ${ringY}px, 0)`;

        requestAnimationFrame(animateCursor);
    }


    animateCursor();


    interactiveElements.forEach((element) => {
        element.addEventListener("pointerenter", () => {
            document.body.classList.add("cursor-active");
        });

        element.addEventListener("pointerleave", () => {
            document.body.classList.remove("cursor-active");
        });
    });


    document.addEventListener("mouseleave", () => {
        document.body.classList.add("cursor-hidden");
    });


    document.addEventListener("mouseenter", () => {
        document.body.classList.remove("cursor-hidden");
    });
} else {
    if (cursorDot) {
        cursorDot.style.display = "none";
    }

    if (cursorRing) {
        cursorRing.style.display = "none";
    }
}


/* =========================================================
   HERO POINTER MOVEMENT
   ========================================================= */

if (hero && precisePointer && !reducedMotion) {
    hero.addEventListener(
        "pointermove",
        (event) => {
            const bounds = hero.getBoundingClientRect();

            const x =
                (event.clientX - bounds.left) /
                bounds.width;

            const y =
                (event.clientY - bounds.top) /
                bounds.height;

            root.style.setProperty(
                "--pointer-x",
                `${(x - 0.5) * 20}px`
            );

            root.style.setProperty(
                "--pointer-y",
                `${(y - 0.5) * 14}px`
            );
        },
        { passive: true }
    );


    hero.addEventListener("pointerleave", () => {
        root.style.setProperty("--pointer-x", "0px");
        root.style.setProperty("--pointer-y", "0px");
    });
}


/* =========================================================
   PROJECT GLOW
   ========================================================= */

if (precisePointer && !reducedMotion) {
    projectCards.forEach((card) => {
        card.addEventListener(
            "pointermove",
            (event) => {
                const bounds = card.getBoundingClientRect();

                card.style.setProperty(
                    "--card-x",
                    `${event.clientX - bounds.left}px`
                );

                card.style.setProperty(
                    "--card-y",
                    `${event.clientY - bounds.top}px`
                );
            },
            { passive: true }
        );
    });
}


/* =========================================================
   CAD WIREFRAME VIEWPORT
   ========================================================= */

const cadViewport = document.querySelector("#cad-visual");
const canvas = document.querySelector("#cad-canvas");

if (canvas && cadViewport) {
    const context = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    let rotationX = -0.52;
    let rotationY = 0.65;

    let targetRotationX = rotationX;
    let targetRotationY = rotationY;

    let pointerInside = false;
    let lastTime = performance.now();


    function resizeCanvas() {
        const bounds = cadViewport.getBoundingClientRect();

        pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        width = bounds.width;
        height = bounds.height;

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        context.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );
    }


    function rotatePoint(point) {
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);

        const xAfterY =
            point.x * cosY -
            point.z * sinY;

        const zAfterY =
            point.x * sinY +
            point.z * cosY;

        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);

        const yAfterX =
            point.y * cosX -
            zAfterY * sinX;

        const zAfterX =
            point.y * sinX +
            zAfterY * cosX;

        return {
            x: xAfterY,
            y: yAfterX,
            z: zAfterX
        };
    }


    function projectPoint(point) {
        const rotated = rotatePoint(point);

        const cameraDistance = 5.6;
        const perspective =
            cameraDistance /
            (cameraDistance + rotated.z);

        const scale =
            Math.min(width, height) * 0.19;

        return {
            x:
                width / 2 +
                rotated.x * scale * perspective,

            y:
                height / 2 +
                rotated.y * scale * perspective,

            z: rotated.z,

            perspective
        };
    }


    function drawLine(
        firstPoint,
        secondPoint,
        color,
        lineWidth = 1
    ) {
        const first = projectPoint(firstPoint);
        const second = projectPoint(secondPoint);

        const depthOpacity =
            Math.max(
                0.22,
                Math.min(
                    1,
                    0.75 -
                    ((first.z + second.z) / 2) * 0.08
                )
            );

        context.beginPath();
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);

        context.strokeStyle = color.replace(
            "OPACITY",
            depthOpacity.toFixed(2)
        );

        context.lineWidth = lineWidth;
        context.stroke();
    }


    function createRing(radius, depth, segments = 42) {
        const points = [];

        for (let index = 0; index < segments; index += 1) {
            const angle =
                (index / segments) *
                Math.PI *
                2;

            points.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                z: depth
            });
        }

        return points;
    }


    function drawRing(points, color, lineWidth = 1) {
        for (
            let index = 0;
            index < points.length;
            index += 1
        ) {
            const nextIndex =
                (index + 1) % points.length;

            drawLine(
                points[index],
                points[nextIndex],
                color,
                lineWidth
            );
        }
    }


    function drawAssembly() {
        const frontOuter = createRing(1.55, -0.48);
        const rearOuter = createRing(1.55, 0.48);

        const frontInner = createRing(0.68, -0.58);
        const rearInner = createRing(0.68, 0.58);

        const hubFront = createRing(0.28, -0.85, 28);
        const hubRear = createRing(0.28, 0.85, 28);

        const blue =
            "rgba(117, 216, 255, OPACITY)";

        const softBlue =
            "rgba(117, 216, 255, OPACITY)";

        const red =
            "rgba(226, 59, 69, OPACITY)";


        drawRing(rearOuter, softBlue);
        drawRing(rearInner, softBlue);
        drawRing(hubRear, red, 1.2);

        drawRing(frontOuter, blue, 1.15);
        drawRing(frontInner, blue);
        drawRing(hubFront, red, 1.2);


        for (
            let index = 0;
            index < frontOuter.length;
            index += 6
        ) {
            drawLine(
                frontOuter[index],
                rearOuter[index],
                softBlue
            );
        }


        for (
            let index = 0;
            index < frontInner.length;
            index += 7
        ) {
            drawLine(
                frontInner[index],
                rearInner[index],
                softBlue
            );
        }


        const spokeCount = 8;

        for (
            let index = 0;
            index < spokeCount;
            index += 1
        ) {
            const angle =
                (index / spokeCount) *
                Math.PI *
                2;

            const nextAngle =
                angle + Math.PI / 10;

            drawLine(
                {
                    x: Math.cos(angle) * 0.3,
                    y: Math.sin(angle) * 0.3,
                    z: -0.62
                },
                {
                    x: Math.cos(nextAngle) * 1.5,
                    y: Math.sin(nextAngle) * 1.5,
                    z: -0.46
                },
                blue,
                1.1
            );

            drawLine(
                {
                    x: Math.cos(angle) * 0.3,
                    y: Math.sin(angle) * 0.3,
                    z: 0.62
                },
                {
                    x: Math.cos(nextAngle) * 1.5,
                    y: Math.sin(nextAngle) * 1.5,
                    z: 0.46
                },
                softBlue
            );
        }


        for (
            let index = 0;
            index < hubFront.length;
            index += 4
        ) {
            drawLine(
                hubFront[index],
                hubRear[index],
                red,
                1.1
            );
        }


        drawLine(
            { x: -2.2, y: 0, z: 0 },
            { x: 2.2, y: 0, z: 0 },
            "rgba(226, 59, 69, OPACITY)",
            1
        );

        drawLine(
            { x: 0, y: -2.2, z: 0 },
            { x: 0, y: 2.2, z: 0 },
            "rgba(117, 216, 255, OPACITY)",
            1
        );

        drawLine(
            { x: 0, y: 0, z: -2.2 },
            { x: 0, y: 0, z: 2.2 },
            "rgba(255, 255, 255, OPACITY)",
            1
        );
    }


    function render(time) {
        const delta =
            Math.min((time - lastTime) / 1000, 0.05);

        lastTime = time;

        if (!pointerInside && !reducedMotion) {
            targetRotationY += delta * 0.22;
        }

        rotationX +=
            (targetRotationX - rotationX) * 0.06;

        rotationY +=
            (targetRotationY - rotationY) * 0.06;

        context.clearRect(0, 0, width, height);

        drawAssembly();

        requestAnimationFrame(render);
    }


    cadViewport.addEventListener(
        "pointermove",
        (event) => {
            if (!precisePointer || reducedMotion) {
                return;
            }

            const bounds =
                cadViewport.getBoundingClientRect();

            const normalizedX =
                (event.clientX - bounds.left) /
                bounds.width;

            const normalizedY =
                (event.clientY - bounds.top) /
                bounds.height;

            targetRotationY =
                (normalizedX - 0.5) * 2.4;

            targetRotationX =
                (normalizedY - 0.5) * -1.6;
        },
        { passive: true }
    );


    cadViewport.addEventListener(
        "pointerenter",
        () => {
            pointerInside = true;
        }
    );


    cadViewport.addEventListener(
        "pointerleave",
        () => {
            pointerInside = false;
            targetRotationX = -0.52;
        }
    );


    const resizeObserver = new ResizeObserver(
        resizeCanvas
    );

    resizeObserver.observe(cadViewport);

    resizeCanvas();
    requestAnimationFrame(render);
}


/* =========================================================
   KEYBOARD NAVIGATION
   ========================================================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
        document.body.classList.add(
            "keyboard-navigation"
        );
    }
});


document.addEventListener("pointerdown", () => {
    document.body.classList.remove(
        "keyboard-navigation"
    );
});