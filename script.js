/* =========================================================
   PRODG PORTFOLIO
   Interactive JavaScript
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});


document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});


/* =========================================================
   CURSOR GLOW
========================================================= */

const cursorGlow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", event => {

    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

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

    const currentCommand =
        commands[commandIndex];


    if (!deleting) {

        typingElement.textContent =
            currentCommand.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;


        if (characterIndex === currentCommand.length) {

            deleting = true;

            setTimeout(typeCommand, 1800);

            return;
        }

    } else {

        typingElement.textContent =
            currentCommand.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;


        if (characterIndex === 0) {

            deleting = false;

            commandIndex =
                (commandIndex + 1) % commands.length;

        }

    }


    setTimeout(
        typeCommand,
        deleting ? 45 : 80
    );

}


typeCommand();


/* =========================================================
   COUNTERS
========================================================= */

const counters =
    document.querySelectorAll(".counter");


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
                    parseFloat(counter.dataset.target);


                let current = 0;

                const duration = 1500;

                const start =
                    performance.now();


                function updateCounter(time) {

                    const progress =
                        Math.min(
                            (time - start) / duration,
                            1
                        );


                    const eased =
                        1 -
                        Math.pow(
                            1 - progress,
                            3
                        );


                    current =
                        target * eased;


                    if (target % 1 !== 0) {

                        counter.textContent =
                            current.toFixed(2);

                    } else {

                        counter.textContent =
                            Math.floor(current) + "+";

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


                counterObserver.unobserve(counter);

            });

        },

        {
            threshold: 0.7
        }

    );


counters.forEach(counter => {

    counterObserver.observe(counter);

});


/* =========================================================
   PROJECT FILTER
========================================================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");


const projectCards =
    document.querySelectorAll(".project-card");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter =
            button.dataset.filter;


        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        projectCards.forEach(card => {

            const category =
                card.dataset.category;


            if (
                filter === "all" ||
                category === filter
            ) {

                card.classList.remove("hidden");

                setTimeout(() => {

                    card.style.opacity = "1";

                }, 50);

            } else {

                card.classList.add("hidden");

            }

        });

    });

});


/* =========================================================
   PROJECT MODAL
========================================================= */

const modal =
    document.getElementById("projectModal");

const modalClose =
    document.getElementById("modalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalCategory =
    document.getElementById("modalCategory");

const modalDescription =
    document.getElementById("modalDescription");

const modalNumber =
    document.getElementById("modalNumber");

const modalTags =
    document.getElementById("modalTags");


const projects = {

    python: {

        number: "01",

        category: "SOFTWARE",

        title: "ProDG Python Runner",

        description:
            "A browser-based Python execution environment designed to connect a frontend interface with a FastAPI backend and safely execute programming experiments.",

        tags: [
            "Python",
            "FastAPI",
            "React",
            "API"
        ]

    },


    cyber: {

        number: "02",

        category: "CYBERSECURITY",

        title: "ProDG Cyber Lab",

        description:
            "A personal cybersecurity environment focused on Linux, networking, security analysis, ethical hacking and defensive security experiments.",

        tags: [
            "Linux",
            "Kali",
            "Networking",
            "Security"
        ]

    },


    locker: {

        number: "03",

        category: "EMBEDDED",

        title: "Smart Door Locker",

        description:
            "An experimental access-control system combining a microcontroller, authentication logic, sensors and physical locking mechanisms.",

        tags: [
            "ESP32",
            "C++",
            "IoT",
            "Sensors"
        ]

    },


    pcb: {

        number: "04",

        category: "ELECTRONICS",

        title: "ProDG Board v1",

        description:
            "An experimental custom PCB concept designed around a microcontroller, sensors and power management.",

        tags: [
            "KiCad",
            "PCB",
            "Electronics"
        ]

    },


    ai: {

        number: "05",

        category: "ARTIFICIAL INTELLIGENCE",

        title: "ProDG Knowledge Assistant",

        description:
            "An experimental AI assistant designed to retrieve information from a personal knowledge base using retrieval augmented generation concepts.",

        tags: [
            "Python",
            "RAG",
            "LLM",
            "AI"
        ]

    },


    cpp: {

        number: "06",

        category: "SYSTEMS",

        title: "Student Management System",

        description:
            "A C++ command-line application exploring classes, objects, structures, file handling and object-oriented programming.",

        tags: [
            "C++",
            "OOP",
            "Files"
        ]

    }

};


document
    .querySelectorAll(".project-open")
    .forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();


            const projectId =
                button.dataset.project;


            const project =
                projects[projectId];


            if (!project) {
                return;
            }


            modalNumber.textContent =
                project.number;

            modalCategory.textContent =
                project.category;

            modalTitle.textContent =
                project.title;

            modalDescription.textContent =
                project.description;


            modalTags.innerHTML = "";


            project.tags.forEach(tag => {

                const element =
                    document.createElement("span");

                element.textContent = tag;

                modalTags.appendChild(element);

            });


            modal.classList.add("active");

            document.body.classList.add(
                "modal-open"
            );

        });

    });


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    modal.classList.remove("active");

    document.body.classList.remove(
        "modal-open"
    );

}


modalClose.addEventListener(
    "click",
    closeModal
);


modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {

            closeModal();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);


/* =========================================================
   PROJECT CARD TILT
========================================================= */

projectCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            if (window.innerWidth < 800) {
                return;
            }


            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX - rect.left;


            const y =
                event.clientY - rect.top;


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

            card.style.transform = "";

        }
    );

});


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

const header =
    document.querySelector(".header");


window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 50) {

            header.style.background =
                "rgba(5,7,10,0.9)";

        } else {

            header.style.background =
                "rgba(5,7,10,0.65)";

        }

    }
);


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(`
========================================
        ProDG SYSTEM
========================================

Rohan Venkatesh Lone
Cybersecurity × Software × AI

System status: ONLINE

"Build. Break. Understand. Teach."

========================================
`);