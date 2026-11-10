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
   FORMULA CAR 3D WIREFRAME
   ========================================================= */

const cadViewport = document.querySelector("#cad-visual");
const canvas = document.querySelector("#cad-canvas");

if (canvas && cadViewport) {
    const context = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    let rotationX = -0.26;
    let rotationY = -0.72;

    let targetRotationX = rotationX;
    let targetRotationY = rotationY;

    let pointerInside = false;
    let lastTime = performance.now();

    const COLORS = {
        primary: [117, 216, 255],
        secondary: [73, 139, 168],
        accent: [226, 59, 69],
        neutral: [220, 228, 232],
        dark: [52, 81, 94]
    };


    /* -----------------------------------------------------
       CANVAS RESIZE
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       3D TRANSFORMATIONS
       ----------------------------------------------------- */

    function rotatePoint(point) {
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);

        const rotatedX =
            point.x * cosY -
            point.z * sinY;

        const rotatedZ =
            point.x * sinY +
            point.z * cosY;

        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);

        const rotatedY =
            point.y * cosX -
            rotatedZ * sinX;

        const finalZ =
            point.y * sinX +
            rotatedZ * cosX;

        return {
            x: rotatedX,
            y: rotatedY,
            z: finalZ
        };
    }


    function projectPoint(point) {
        const rotated = rotatePoint(point);

        const cameraDistance = 12;

        const perspective =
            cameraDistance /
            Math.max(cameraDistance + rotated.z, 1);

        const scale =
            Math.min(width, height) * 0.115;

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


    function makeColor(rgb, opacity) {
        return `rgba(
            ${rgb[0]},
            ${rgb[1]},
            ${rgb[2]},
            ${opacity}
        )`;
    }


    function calculateDepthOpacity(first, second) {
        const averageDepth =
            (first.z + second.z) / 2;

        return Math.max(
            0.16,
            Math.min(
                0.95,
                0.72 - averageDepth * 0.045
            )
        );
    }


    /* -----------------------------------------------------
       DRAWING PRIMITIVES
       ----------------------------------------------------- */

    function drawLine(
        firstPoint,
        secondPoint,
        color = COLORS.primary,
        lineWidth = 1
    ) {
        const first = projectPoint(firstPoint);
        const second = projectPoint(secondPoint);

        const opacity =
            calculateDepthOpacity(first, second);

        context.beginPath();
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);

        context.strokeStyle =
            makeColor(color, opacity);

        context.lineWidth = lineWidth;
        context.stroke();
    }


    function drawPolyline(
        points,
        color = COLORS.primary,
        lineWidth = 1,
        closed = false
    ) {
        if (points.length < 2) {
            return;
        }

        const projectedPoints =
            points.map(projectPoint);

        context.beginPath();

        context.moveTo(
            projectedPoints[0].x,
            projectedPoints[0].y
        );

        for (
            let index = 1;
            index < projectedPoints.length;
            index += 1
        ) {
            context.lineTo(
                projectedPoints[index].x,
                projectedPoints[index].y
            );
        }

        if (closed) {
            context.closePath();
        }

        const averageDepth =
            projectedPoints.reduce(
                (total, point) => total + point.z,
                0
            ) / projectedPoints.length;

        const opacity = Math.max(
            0.18,
            Math.min(
                0.95,
                0.72 - averageDepth * 0.045
            )
        );

        context.strokeStyle =
            makeColor(color, opacity);

        context.lineWidth = lineWidth;
        context.stroke();
    }


    function createCircle(
        center,
        radius,
        plane = "xy",
        segments = 30
    ) {
        const points = [];

        for (
            let index = 0;
            index < segments;
            index += 1
        ) {
            const angle =
                index / segments *
                Math.PI *
                2;

            let point;

            if (plane === "xy") {
                point = {
                    x: center.x + Math.cos(angle) * radius,
                    y: center.y + Math.sin(angle) * radius,
                    z: center.z
                };
            } else if (plane === "yz") {
                point = {
                    x: center.x,
                    y: center.y + Math.cos(angle) * radius,
                    z: center.z + Math.sin(angle) * radius
                };
            } else {
                point = {
                    x: center.x + Math.cos(angle) * radius,
                    y: center.y,
                    z: center.z + Math.sin(angle) * radius
                };
            }

            points.push(point);
        }

        return points;
    }


    function drawCircle(
        center,
        radius,
        plane,
        color,
        lineWidth = 1,
        segments = 30
    ) {
        const points = createCircle(
            center,
            radius,
            plane,
            segments
        );

        drawPolyline(
            points,
            color,
            lineWidth,
            true
        );
    }


    function drawBox(
        center,
        size,
        color = COLORS.primary,
        lineWidth = 1
    ) {
        const halfX = size.x / 2;
        const halfY = size.y / 2;
        const halfZ = size.z / 2;

        const vertices = [
            {
                x: center.x - halfX,
                y: center.y - halfY,
                z: center.z - halfZ
            },
            {
                x: center.x + halfX,
                y: center.y - halfY,
                z: center.z - halfZ
            },
            {
                x: center.x + halfX,
                y: center.y + halfY,
                z: center.z - halfZ
            },
            {
                x: center.x - halfX,
                y: center.y + halfY,
                z: center.z - halfZ
            },
            {
                x: center.x - halfX,
                y: center.y - halfY,
                z: center.z + halfZ
            },
            {
                x: center.x + halfX,
                y: center.y - halfY,
                z: center.z + halfZ
            },
            {
                x: center.x + halfX,
                y: center.y + halfY,
                z: center.z + halfZ
            },
            {
                x: center.x - halfX,
                y: center.y + halfY,
                z: center.z + halfZ
            }
        ];

        const edges = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],

            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4],

            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
        ];

        edges.forEach(([firstIndex, secondIndex]) => {
            drawLine(
                vertices[firstIndex],
                vertices[secondIndex],
                color,
                lineWidth
            );
        });
    }


    /* -----------------------------------------------------
       FORMULA CAR WHEELS
       x = longitudinal axis
       y = vertical axis
       z = transverse axis
       ----------------------------------------------------- */

    function drawWheel(x, z, frontWheel) {
        const radius =
            frontWheel ? 0.72 : 0.78;

        const width =
            frontWheel ? 0.46 : 0.55;

        const outerZ =
            z + Math.sign(z) * width / 2;

        const innerZ =
            z - Math.sign(z) * width / 2;

        const centerY = 0.74;

        const outerCenter = {
            x,
            y: centerY,
            z: outerZ
        };

        const innerCenter = {
            x,
            y: centerY,
            z: innerZ
        };

        drawCircle(
            outerCenter,
            radius,
            "xy",
            COLORS.primary,
            1.35,
            34
        );

        drawCircle(
            innerCenter,
            radius,
            "xy",
            COLORS.secondary,
            0.85,
            34
        );

        drawCircle(
            outerCenter,
            radius * 0.58,
            "xy",
            COLORS.accent,
            1.05,
            28
        );

        drawCircle(
            outerCenter,
            radius * 0.21,
            "xy",
            COLORS.neutral,
            1,
            22
        );

        const spokeCount = 10;

        for (
            let index = 0;
            index < spokeCount;
            index += 1
        ) {
            const angle =
                index / spokeCount *
                Math.PI *
                2;

            drawLine(
                {
                    x:
                        x +
                        Math.cos(angle) *
                        radius *
                        0.23,

                    y:
                        centerY +
                        Math.sin(angle) *
                        radius *
                        0.23,

                    z: outerZ
                },
                {
                    x:
                        x +
                        Math.cos(angle) *
                        radius *
                        0.55,

                    y:
                        centerY +
                        Math.sin(angle) *
                        radius *
                        0.55,

                    z: outerZ
                },
                COLORS.primary,
                0.75
            );
        }

        for (
            let index = 0;
            index < 34;
            index += 5
        ) {
            const angle =
                index / 34 *
                Math.PI *
                2;

            drawLine(
                {
                    x:
                        x +
                        Math.cos(angle) *
                        radius,

                    y:
                        centerY +
                        Math.sin(angle) *
                        radius,

                    z: outerZ
                },
                {
                    x:
                        x +
                        Math.cos(angle) *
                        radius,

                    y:
                        centerY +
                        Math.sin(angle) *
                        radius,

                    z: innerZ
                },
                COLORS.dark,
                0.8
            );
        }
    }


    /* -----------------------------------------------------
       MAIN BODY
       ----------------------------------------------------- */

    function drawBody() {
        const centerLineTop = [
            { x: -4.5, y: 0.58, z: 0 },
            { x: -3.3, y: 0.48, z: 0 },
            { x: -2.0, y: 0.42, z: 0 },
            { x: -0.8, y: 0.35, z: 0 },
            { x: 0.2, y: 0.15, z: 0 },
            { x: 1.15, y: -0.28, z: 0 },
            { x: 2.25, y: -0.42, z: 0 },
            { x: 3.3, y: -0.32, z: 0 },
            { x: 4.1, y: 0.05, z: 0 }
        ];

        drawPolyline(
            centerLineTop,
            COLORS.primary,
            1.4
        );

        const bodySections = [
            {
                x: -3.85,
                y: 0.48,
                halfWidth: 0.17,
                halfHeight: 0.13
            },
            {
                x: -2.8,
                y: 0.38,
                halfWidth: 0.26,
                halfHeight: 0.16
            },
            {
                x: -1.7,
                y: 0.25,
                halfWidth: 0.43,
                halfHeight: 0.22
            },
            {
                x: -0.65,
                y: 0.14,
                halfWidth: 0.68,
                halfHeight: 0.31
            },
            {
                x: 0.45,
                y: -0.12,
                halfWidth: 0.78,
                halfHeight: 0.4
            },
            {
                x: 1.45,
                y: -0.29,
                halfWidth: 0.72,
                halfHeight: 0.42
            },
            {
                x: 2.4,
                y: -0.27,
                halfWidth: 0.58,
                halfHeight: 0.4
            },
            {
                x: 3.35,
                y: -0.08,
                halfWidth: 0.37,
                halfHeight: 0.3
            }
        ];

        const sectionCorners = bodySections.map(
            (section) => ({
                upperLeft: {
                    x: section.x,
                    y: section.y - section.halfHeight,
                    z: -section.halfWidth
                },
                upperRight: {
                    x: section.x,
                    y: section.y - section.halfHeight,
                    z: section.halfWidth
                },
                lowerLeft: {
                    x: section.x,
                    y: section.y + section.halfHeight,
                    z: -section.halfWidth
                },
                lowerRight: {
                    x: section.x,
                    y: section.y + section.halfHeight,
                    z: section.halfWidth
                }
            })
        );

        sectionCorners.forEach((section) => {
            drawPolyline(
                [
                    section.upperLeft,
                    section.upperRight,
                    section.lowerRight,
                    section.lowerLeft
                ],
                COLORS.secondary,
                0.75,
                true
            );
        });

        for (
            let index = 0;
            index < sectionCorners.length - 1;
            index += 1
        ) {
            const current = sectionCorners[index];
            const next = sectionCorners[index + 1];

            drawLine(
                current.upperLeft,
                next.upperLeft,
                COLORS.primary,
                1
            );

            drawLine(
                current.upperRight,
                next.upperRight,
                COLORS.primary,
                1
            );

            drawLine(
                current.lowerLeft,
                next.lowerLeft,
                COLORS.secondary,
                0.8
            );

            drawLine(
                current.lowerRight,
                next.lowerRight,
                COLORS.secondary,
                0.8
            );
        }
    }


    /* -----------------------------------------------------
       FRONT WING
       ----------------------------------------------------- */

    function drawFrontWing() {
        const wingX = -4.55;

        const mainPlane = [
            { x: wingX - 0.28, y: 0.7, z: -1.72 },
            { x: wingX + 0.28, y: 0.7, z: -1.72 },
            { x: wingX + 0.42, y: 0.7, z: 1.72 },
            { x: wingX - 0.28, y: 0.7, z: 1.72 }
        ];

        drawPolyline(
            mainPlane,
            COLORS.primary,
            1.2,
            true
        );

        const secondaryPlane = [
            { x: wingX + 0.18, y: 0.54, z: -1.52 },
            { x: wingX + 0.52, y: 0.54, z: -1.52 },
            { x: wingX + 0.6, y: 0.54, z: 1.52 },
            { x: wingX + 0.18, y: 0.54, z: 1.52 }
        ];

        drawPolyline(
            secondaryPlane,
            COLORS.secondary,
            0.9,
            true
        );

        drawBox(
            {
                x: wingX,
                y: 0.45,
                z: -1.69
            },
            {
                x: 0.18,
                y: 0.75,
                z: 0.1
            },
            COLORS.accent,
            1
        );

        drawBox(
            {
                x: wingX,
                y: 0.45,
                z: 1.69
            },
            {
                x: 0.18,
                y: 0.75,
                z: 0.1
            },
            COLORS.accent,
            1
        );

        drawLine(
            { x: -4.2, y: 0.58, z: 0 },
            { x: wingX, y: 0.64, z: 0 },
            COLORS.neutral,
            1
        );
    }


    /* -----------------------------------------------------
       REAR WING
       ----------------------------------------------------- */

    function drawRearWing() {
        const rearX = 3.82;

        drawBox(
            {
                x: rearX,
                y: -0.95,
                z: 0
            },
            {
                x: 0.42,
                y: 0.14,
                z: 2.55
            },
            COLORS.primary,
            1.2
        );

        drawBox(
            {
                x: rearX + 0.15,
                y: -0.65,
                z: 0
            },
            {
                x: 0.35,
                y: 0.12,
                z: 2.3
            },
            COLORS.secondary,
            0.95
        );

        drawBox(
            {
                x: rearX,
                y: -0.58,
                z: -1.28
            },
            {
                x: 0.46,
                y: 0.95,
                z: 0.08
            },
            COLORS.accent,
            1
        );

        drawBox(
            {
                x: rearX,
                y: -0.58,
                z: 1.28
            },
            {
                x: 0.46,
                y: 0.95,
                z: 0.08
            },
            COLORS.accent,
            1
        );

        drawLine(
            { x: 3.25, y: -0.1, z: -0.38 },
            { x: rearX, y: -0.65, z: -0.55 },
            COLORS.neutral,
            1
        );

        drawLine(
            { x: 3.25, y: -0.1, z: 0.38 },
            { x: rearX, y: -0.65, z: 0.55 },
            COLORS.neutral,
            1
        );
    }


    /* -----------------------------------------------------
       FLOOR AND DIFFUSER
       ----------------------------------------------------- */

    function drawFloor() {
        const floorOutline = [
            { x: -1.75, y: 0.62, z: -0.74 },
            { x: 2.75, y: 0.62, z: -0.82 },
            { x: 3.55, y: 0.48, z: -0.66 },
            { x: 3.55, y: 0.48, z: 0.66 },
            { x: 2.75, y: 0.62, z: 0.82 },
            { x: -1.75, y: 0.62, z: 0.74 }
        ];

        drawPolyline(
            floorOutline,
            COLORS.secondary,
            1,
            true
        );

        for (
            let index = 0;
            index < 6;
            index += 1
        ) {
            const z =
                -0.65 + index * 0.26;

            drawLine(
                { x: 2.45, y: 0.58, z },
                { x: 3.55, y: 0.35, z: z * 0.82 },
                COLORS.primary,
                0.75
            );
        }
    }


    /* -----------------------------------------------------
       SIDE PODS
       ----------------------------------------------------- */

    function drawSidePods() {
        [-1, 1].forEach((side) => {
            const pod = [
                {
                    x: -0.3,
                    y: -0.02,
                    z: side * 0.65
                },
                {
                    x: 0.45,
                    y: -0.34,
                    z: side * 1.05
                },
                {
                    x: 1.65,
                    y: -0.27,
                    z: side * 0.98
                },
                {
                    x: 2.55,
                    y: -0.08,
                    z: side * 0.62
                },
                {
                    x: 1.7,
                    y: 0.42,
                    z: side * 0.65
                },
                {
                    x: 0.3,
                    y: 0.4,
                    z: side * 0.72
                }
            ];

            drawPolyline(
                pod,
                COLORS.primary,
                1,
                true
            );

            drawLine(
                pod[0],
                pod[3],
                COLORS.secondary,
                0.75
            );

            drawLine(
                pod[1],
                pod[4],
                COLORS.secondary,
                0.75
            );

            drawLine(
                pod[2],
                pod[5],
                COLORS.secondary,
                0.75
            );
        });
    }


    /* -----------------------------------------------------
       COCKPIT AND HALO
       ----------------------------------------------------- */

    function drawCockpitAndHalo() {
        const cockpit = [
            { x: -0.35, y: -0.46, z: -0.42 },
            { x: 0.42, y: -0.78, z: -0.34 },
            { x: 1.05, y: -0.6, z: -0.29 },
            { x: 1.25, y: -0.32, z: -0.36 },

            { x: 1.25, y: -0.32, z: 0.36 },
            { x: 1.05, y: -0.6, z: 0.29 },
            { x: 0.42, y: -0.78, z: 0.34 },
            { x: -0.35, y: -0.46, z: 0.42 }
        ];

        drawPolyline(
            cockpit,
            COLORS.accent,
            1.2,
            true
        );

        const haloTop = [
            { x: 0.15, y: -1.05, z: -0.45 },
            { x: 0.7, y: -1.18, z: -0.5 },
            { x: 1.15, y: -1.02, z: -0.42 },

            { x: 1.15, y: -1.02, z: 0.42 },
            { x: 0.7, y: -1.18, z: 0.5 },
            { x: 0.15, y: -1.05, z: 0.45 }
        ];

        drawPolyline(
            haloTop,
            COLORS.neutral,
            1.35,
            false
        );

        drawLine(
            { x: 0.15, y: -1.05, z: -0.45 },
            { x: 0.0, y: -0.4, z: -0.38 },
            COLORS.neutral,
            1.2
        );

        drawLine(
            { x: 0.15, y: -1.05, z: 0.45 },
            { x: 0.0, y: -0.4, z: 0.38 },
            COLORS.neutral,
            1.2
        );

        drawLine(
            { x: 1.15, y: -1.02, z: -0.42 },
            { x: 1.0, y: -0.38, z: -0.31 },
            COLORS.neutral,
            1.2
        );

        drawLine(
            { x: 1.15, y: -1.02, z: 0.42 },
            { x: 1.0, y: -0.38, z: 0.31 },
            COLORS.neutral,
            1.2
        );

        drawLine(
            { x: 0.7, y: -1.18, z: 0 },
            { x: 0.35, y: -0.34, z: 0 },
            COLORS.neutral,
            1.25
        );
    }


    /* -----------------------------------------------------
       SUSPENSION
       ----------------------------------------------------- */

    function drawSuspension() {
        const axleConfigurations = [
            {
                x: -2.7,
                bodyX: -1.7,
                bodyY: 0.2
            },
            {
                x: 2.65,
                bodyX: 2.05,
                bodyY: 0.05
            }
        ];

        axleConfigurations.forEach((axle) => {
            [-1, 1].forEach((side) => {
                const wheelZ = side * 1.48;
                const bodyZ = side * 0.55;

                drawLine(
                    {
                        x: axle.bodyX,
                        y: axle.bodyY,
                        z: bodyZ
                    },
                    {
                        x: axle.x,
                        y: 0.62,
                        z: wheelZ
                    },
                    COLORS.neutral,
                    0.9
                );

                drawLine(
                    {
                        x: axle.bodyX + 0.35,
                        y: 0.48,
                        z: bodyZ
                    },
                    {
                        x: axle.x,
                        y: 0.85,
                        z: wheelZ
                    },
                    COLORS.secondary,
                    0.85
                );

                drawLine(
                    {
                        x: axle.bodyX - 0.18,
                        y: -0.05,
                        z: bodyZ
                    },
                    {
                        x: axle.x,
                        y: 0.7,
                        z: wheelZ
                    },
                    COLORS.primary,
                    0.85
                );
            });
        });
    }


    /* -----------------------------------------------------
       ENGINE COVER AND AIRBOX
       ----------------------------------------------------- */

    function drawEngineCover() {
        const coverLeft = [
            { x: 1.1, y: -0.45, z: -0.38 },
            { x: 1.65, y: -0.92, z: -0.28 },
            { x: 2.45, y: -0.72, z: -0.22 },
            { x: 3.2, y: -0.2, z: -0.3 }
        ];

        const coverRight = coverLeft.map(
            (point) => ({
                x: point.x,
                y: point.y,
                z: -point.z
            })
        );

        drawPolyline(
            coverLeft,
            COLORS.primary,
            1.1
        );

        drawPolyline(
            coverRight,
            COLORS.primary,
            1.1
        );

        for (
            let index = 0;
            index < coverLeft.length;
            index += 1
        ) {
            drawLine(
                coverLeft[index],
                coverRight[index],
                COLORS.secondary,
                0.8
            );
        }

        drawCircle(
            {
                x: 1.58,
                y: -1.02,
                z: 0
            },
            0.25,
            "yz",
            COLORS.accent,
            1,
            24
        );
    }


    /* -----------------------------------------------------
       REFERENCE AXES
       ----------------------------------------------------- */

    function drawAxes() {
        drawLine(
            { x: -5.4, y: 1.7, z: 0 },
            { x: 5.1, y: 1.7, z: 0 },
            COLORS.accent,
            0.7
        );

        drawLine(
            { x: 0, y: -2, z: 0 },
            { x: 0, y: 2.1, z: 0 },
            COLORS.primary,
            0.7
        );

        drawLine(
            { x: 0, y: 1.7, z: -2.2 },
            { x: 0, y: 1.7, z: 2.2 },
            COLORS.neutral,
            0.7
        );
    }


    /* -----------------------------------------------------
       COMPLETE FORMULA CAR
       ----------------------------------------------------- */

    function drawFormulaCar() {
        drawAxes();
        drawFloor();
        drawBody();
        drawSidePods();
        drawCockpitAndHalo();
        drawEngineCover();
        drawSuspension();
        drawFrontWing();
        drawRearWing();

        drawWheel(-2.7, -1.48, true);
        drawWheel(-2.7, 1.48, true);

        drawWheel(2.65, -1.48, false);
        drawWheel(2.65, 1.48, false);
    }


    /* -----------------------------------------------------
       ANIMATION
       ----------------------------------------------------- */

    function render(time) {
        const delta = Math.min(
            (time - lastTime) / 1000,
            0.05
        );

        lastTime = time;

        if (!pointerInside && !reducedMotion) {
            targetRotationY += delta * 0.16;
        }

        rotationX +=
            (targetRotationX - rotationX) * 0.055;

        rotationY +=
            (targetRotationY - rotationY) * 0.055;

        context.clearRect(
            0,
            0,
            width,
            height
        );

        drawFormulaCar();

        requestAnimationFrame(render);
    }


    /* -----------------------------------------------------
       POINTER CONTROL
       ----------------------------------------------------- */

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
                (normalizedX - 0.5) * 2.5;

            targetRotationX =
                -0.3 +
                (normalizedY - 0.5) * -1.2;
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

            targetRotationX = -0.26;
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