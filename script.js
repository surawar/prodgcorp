/* =========================================================
   PRODG CORP — VERSION 2
   Complete Interactive JavaScript
========================================================= */

"use strict";

console.log("========================================");
console.log("        ProDG SYSTEM INITIALIZING");
console.log("========================================");


/* =========================================================
   BACKEND
========================================================= */

const API_URL = "https://prodgcorp.onrender.com/projects";

let projects = {};


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

}


document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        if (navLinks) {
            navLinks.classList.remove("active");
        }

    });

});


/* =========================================================
   CURSOR GLOW
========================================================= */

const cursorGlow =
    document.querySelector(".cursor-glow");


if (cursorGlow) {

    document.addEventListener("mousemove", event => {

        cursorGlow.style.left =
            `${event.clientX}px`;

        cursorGlow.style.top =
            `${event.clientY}px`;

    });

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

}
else {

    revealElements.forEach(element => {

        element.classList.add("visible");

    });

}


/* =========================================================
   TERMINAL TYPING
========================================================= */

const typingElement =
    document.getElementById("typingCommand");


const commands = [

    "./build_future",

    "python main.py",

    "scan --systems",

    "learn --everything",

    "sudo ./create"

];


let commandIndex = 0;

let characterIndex = 0;

let deleting = false;


function typeCommand() {

    if (!typingElement) {
        return;
    }


    const currentCommand =
        commands[commandIndex];


    if (!deleting) {

        typingElement.textContent =
            currentCommand.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;


        if (
            characterIndex >=
            currentCommand.length
        ) {

            deleting = true;

            setTimeout(
                typeCommand,
                1800
            );

            return;

        }

    }
    else {

        typingElement.textContent =
            currentCommand.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;


        if (characterIndex <= 0) {

            deleting = false;

            commandIndex =
                (commandIndex + 1)
                % commands.length;

        }

    }


    setTimeout(

        typeCommand,

        deleting ? 45 : 80

    );

}


if (typingElement) {

    typeCommand();

}


/* =========================================================
   COUNTERS
========================================================= */

const counters =
    document.querySelectorAll(".counter");


if (
    counters.length > 0 &&
    "IntersectionObserver" in window
) {

    const counterObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const counter =
                        entry.target;


                    const target =
                        parseFloat(
                            counter.dataset.target
                        );


                    if (isNaN(target)) {
                        return;
                    }


                    const duration = 1500;

                    const start =
                        performance.now();


                    function updateCounter(time) {

                        const progress =
                            Math.min(

                                (time - start)
                                / duration,

                                1

                            );


                        const eased =
                            1 -
                            Math.pow(
                                1 - progress,
                                3
                            );


                        const current =
                            target * eased;


                        if (
                            target % 1 !== 0
                        ) {

                            counter.textContent =
                                current.toFixed(2);

                        }
                        else {

                            counter.textContent =
                                Math.floor(
                                    current
                                ) + "+";

                        }


                        if (progress < 1) {

                            requestAnimationFrame(
                                updateCounter
                            );

                        }

                    }


                    requestAnimationFrame(
                        updateCounter
                    );


                    counterObserver.unobserve(
                        counter
                    );

                });

            },

            {
                threshold: 0.7
            }

        );


    counters.forEach(counter => {

        counterObserver.observe(counter);

    });

}


/* =========================================================
   PROJECT CATEGORY
========================================================= */

function getProjectCategory(technology) {

    const tech =
        String(technology || "")
        .toLowerCase();


    if (
        tech.includes("python") ||
        tech.includes("fastapi") ||
        tech.includes("react") ||
        tech.includes("javascript") ||
        tech.includes("c++") ||
        tech.includes("cpp")
    ) {

        return "software";

    }


    if (
        tech.includes("linux") ||
        tech.includes("network") ||
        tech.includes("security") ||
        tech.includes("kali") ||
        tech.includes("cyber")
    ) {

        return "security";

    }


    if (
        tech.includes("esp32") ||
        tech.includes("arduino") ||
        tech.includes("iot") ||
        tech.includes("embedded")
    ) {

        return "hardware";

    }


    if (
        tech.includes("pcb") ||
        tech.includes("electronics") ||
        tech.includes("kicad")
    ) {

        return "hardware";

    }


    if (
        tech.includes("ai") ||
        tech.includes("llm") ||
        tech.includes("rag") ||
        tech.includes("machine learning")
    ) {

        return "ai";

    }


    return "software";

}


/* =========================================================
   LOAD PROJECTS FROM FASTAPI
========================================================= */

async function loadProjects() {

    console.log(
        "Connecting to backend..."
    );

    console.log(
        "API:",
        API_URL
    );


    try {

        const response =
            await fetch(API_URL);


        console.log(
            "Backend response:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Backend returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Projects received:",
            data
        );


        if (!Array.isArray(data)) {

            throw new Error(
                "Backend did not return an array"
            );

        }


        const projectGrid =
            document.querySelector(
                ".project-grid"
            );


        if (!projectGrid) {

            console.error(
                "ERROR: .project-grid not found"
            );

            return;

        }


        /*
            Remove the hard-coded project cards.
            Backend will create them.
        */

        projectGrid.innerHTML = "";


        data.forEach(
            (project, index) => {

                const id =
                    "project-" + index;


                /*
                    Store project information
                    for the modal.
                */

                projects[id] = {

                    number:
                        String(index + 1)
                        .padStart(2, "0"),

                    category:
                        project.technology ||
                        "PROJECT",

                    title:
                        project.name ||
                        "Unnamed Project",

                    description:
                        project.description ||
                        "No description available.",

                    tags:
                        String(
                            project.technology ||
                            ""
                        )
                        .split(",")
                        .map(
                            tag =>
                            tag.trim()
                        )
                        .filter(
                            tag =>
                            tag.length > 0
                        ),

                    github:
                        project.github || "",

                    live_url:
                        project.live_url || ""

                };


                /*
                    Create project card.
                */

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "project-card reveal";


                card.dataset.category =
                    getProjectCategory(
                        project.technology
                    );


                card.dataset.project =
                    id;


                card.innerHTML = `

                    <div class="project-visual">

                        <div class="backend-project-number">

                            ${String(index + 1).padStart(2, "0")}

                        </div>

                        <div class="visual-label">

                            ${project.technology || "PROJECT"}

                        </div>

                    </div>


                    <div class="project-content">

                        <div class="project-meta">

                            ${project.technology || "PROJECT"}

                            <span>
                                ${String(index + 1).padStart(2, "0")}
                            </span>

                        </div>


                        <h3>

                            ${project.name || "Unnamed Project"}

                        </h3>


                        <p>

                            ${project.description || ""}

                        </p>


                        <div class="tags">

                            ${
                                String(
                                    project.technology || ""
                                )
                                .split(",")
                                .map(
                                    tech =>
                                    `<span>${tech.trim()}</span>`
                                )
                                .join("")
                            }

                        </div>


                        <button
                            class="project-open"
                            data-project="${id}">

                            Explore project →

                        </button>

                    </div>

                `;


                projectGrid.appendChild(
                    card
                );

            }
        );


        /*
            IMPORTANT:
            The cards did not exist when
            the page originally loaded.

            Therefore we initialize all
            interactions AFTER creating them.
        */

        initializeProjectInteractions();


        console.log(
            `Loaded ${data.length} projects successfully.`
        );

    }
    catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "BACKEND ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================"
        );

    }

}


/* =========================================================
   PROJECT FILTERS
========================================================= */

function initializeProjectFilters() {

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter;


                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                const cards =
                    document.querySelectorAll(
                        ".project-card"
                    );


                cards.forEach(card => {

                    const category =
                        card.dataset.category;


                    if (
                        filter === "all" ||
                        category === filter
                    ) {

                        card.classList.remove(
                            "hidden"
                        );

                    }
                    else {

                        card.classList.add(
                            "hidden"
                        );

                    }

                });

            }
        );

    });

}


/* =========================================================
   PROJECT MODAL
========================================================= */

const modal =
    document.getElementById(
        "projectModal"
    );


const modalClose =
    document.getElementById(
        "modalClose"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const modalCategory =
    document.getElementById(
        "modalCategory"
    );


const modalDescription =
    document.getElementById(
        "modalDescription"
    );


const modalNumber =
    document.getElementById(
        "modalNumber"
    );


const modalTags =
    document.getElementById(
        "modalTags"
    );


function openProjectModal(projectId) {

    const project =
        projects[projectId];


    if (!project) {

        console.error(
            "Project not found:",
            projectId
        );

        return;

    }


    if (!modal) {

        console.error(
            "Project modal not found."
        );

        return;

    }


    if (modalNumber) {

        modalNumber.textContent =
            project.number;

    }


    if (modalCategory) {

        modalCategory.textContent =
            project.category;

    }


    if (modalTitle) {

        modalTitle.textContent =
            project.title;

    }


    if (modalDescription) {

        modalDescription.textContent =
            project.description;

    }


    if (modalTags) {

        modalTags.innerHTML = "";


        project.tags.forEach(tag => {

            const element =
                document.createElement(
                    "span"
                );


            element.textContent =
                tag;


            modalTags.appendChild(
                element
            );

        });


        /*
            Add GitHub / Live buttons
            if backend provides URLs.
        */

        if (project.github) {

            const github =
                document.createElement(
                    "a"
                );


            github.href =
                project.github;


            github.target =
                "_blank";


            github.rel =
                "noopener";


            github.textContent =
                "GitHub ↗";


            github.className =
                "modal-project-link";


            modalTags.appendChild(
                github
            );

        }


        if (project.live_url) {

            const live =
                document.createElement(
                    "a"
                );


            live.href =
                project.live_url;


            live.target =
                "_blank";


            live.rel =
                "noopener";


            live.textContent =
                "Live Website ↗";


            live.className =
                "modal-project-link";


            modalTags.appendChild(
                live
            );

        }

    }


    modal.classList.add(
        "active"
    );


    document.body.classList.add(
        "modal-open"
    );


    console.log(
        "Opened project:",
        project.title
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeModal
    );

}


if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeModal();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   PROJECT CARD INTERACTIONS
========================================================= */

function initializeProjectInteractions() {

    console.log(
        "Initializing project interactions..."
    );


    const projectCards =
        document.querySelectorAll(
            ".project-card"
        );


    console.log(
        "Project cards:",
        projectCards.length
    );


    projectCards.forEach(card => {


        /* =========================================
           MODAL BUTTON
        ========================================= */

        const openButton =
            card.querySelector(
                ".project-open"
            );


        if (openButton) {

            openButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const projectId =
                        openButton.dataset.project;


                    openProjectModal(
                        projectId
                    );

                }
            );

        }


        /* =========================================
           CARD TILT
        ========================================= */

        card.addEventListener(
            "mousemove",
            event => {

                if (
                    window.innerWidth < 800
                ) {

                    return;

                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    (y - centerY) / 35;


                const rotateY =
                    (centerX - x) / 35;


                card.style.transform =
                    `perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-5px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );


        /* =========================================
           REVEAL
        ========================================= */

        card.classList.add(
            "visible"
        );

    });


    console.log(
        "Project interactions ready."
    );

}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

const header =
    document.querySelector(
        ".header"
    );


if (header) {

    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 50
            ) {

                header.style.background =
                    "rgba(5,7,10,0.9)";

            }
            else {

                header.style.background =
                    "rgba(5,7,10,0.65)";

            }

        }
    );

}


/* =========================================================
   START
========================================================= */

document.documentElement.classList.add(
    "js-enabled"
);


initializeProjectFilters();


loadProjects();


/* =========================================================
   FINAL CONSOLE MESSAGE
========================================================= */

console.log(`
========================================
          ProDG SYSTEM
========================================

Rohan Venkatesh Lone

Cybersecurity × Software × AI

Backend:
${API_URL}

System status: ONLINE

"Build. Break. Understand. Teach."

========================================
`);