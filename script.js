"use strict";

/* The static cards in index.html are the canonical project catalogue and
   remain available when the API is unavailable. The API may only enrich a
   matching card with optional links or refreshed copy. */
const API_URL = window.PRODG_API_URL || "https://prodgcorp.onrender.com/projects";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const projects = new Map();

let activeProjectId = null;
let lastFocusedElement = null;

function text(selector, root) {
    return root.querySelector(selector)?.textContent.trim() || "";
}

function getProjectFromCard(card) {
    const id = card.dataset.project;
    return {
        id,
        number: text(".project-meta span", card),
        category: card.dataset.category || "project",
        title: text("h3", card),
        description: text(".project-content p", card),
        tags: [...card.querySelectorAll(".tags span")].map(tag => tag.textContent.trim()),
        github: "",
        liveUrl: ""
    };
}

function isSafeUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}

function initialiseMenu() {
    const menuButton = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");
    if (!menuButton || !navLinks) return;

    const setMenu = isOpen => {
        navLinks.classList.toggle("active", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    };

    menuButton.addEventListener("click", () => setMenu(!navLinks.classList.contains("active")));
    navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 750) setMenu(false);
    });
}

function initialiseReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
        elements.forEach(element => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    elements.forEach(element => observer.observe(element));
}

function initialiseCounters() {
    const counters = document.querySelectorAll(".counter");
    const setFinalValue = counter => {
        const target = Number(counter.dataset.target);
        counter.textContent = Number.isInteger(target) ? `${target}+` : target.toFixed(2);
    };

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
        counters.forEach(setFinalValue);
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            const target = Number(counter.dataset.target);
            const start = performance.now();
            const duration = 1200;
            const update = now => {
                const progress = Math.min((now - start) / duration, 1);
                const value = target * (1 - Math.pow(1 - progress, 3));
                counter.textContent = Number.isInteger(target) ? `${Math.floor(value)}+` : value.toFixed(2);
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
            observer.unobserve(counter);
        });
    }, { threshold: 0.7 });
    counters.forEach(counter => observer.observe(counter));
}

function initialiseTyping() {
    const target = document.getElementById("typingCommand");
    if (!target) return;
    const commands = ["./build_future", "python main.py", "scan --systems", "learn --everything", "sudo ./create"];
    if (reduceMotion.matches) {
        target.textContent = commands[0];
        return;
    }

    let commandIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const type = () => {
        const command = commands[commandIndex];
        target.textContent = command.slice(0, charIndex);
        if (!deleting && charIndex < command.length) {
            charIndex += 1;
            window.setTimeout(type, 70);
        } else if (!deleting) {
            deleting = true;
            window.setTimeout(type, 1300);
        } else if (charIndex > 0) {
            charIndex -= 1;
            window.setTimeout(type, 35);
        } else {
            deleting = false;
            commandIndex = (commandIndex + 1) % commands.length;
            window.setTimeout(type, 250);
        }
    };
    type();
}

function initialiseProjects() {
    document.querySelectorAll(".project-card").forEach(card => {
        const project = getProjectFromCard(card);
        projects.set(project.id, project);
        const button = card.querySelector(".project-open");
        if (button) button.addEventListener("click", () => openProjectModal(project.id));
        initialiseCardTilt(card);
    });
}

function initialiseFilters() {
    const buttons = [...document.querySelectorAll(".filter-btn")];
    const cards = [...document.querySelectorAll(".project-card")];
    buttons.forEach(button => button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach(item => {
            const selected = item === button;
            item.classList.toggle("active", selected);
            item.setAttribute("aria-pressed", String(selected));
        });
        cards.forEach(card => {
            const isVisible = filter === "all" || card.dataset.category === filter;
            card.classList.toggle("hidden", !isVisible);
            card.hidden = !isVisible;
        });
    }));
}

function initialiseCardTilt(card) {
    if (reduceMotion.matches || window.matchMedia("(pointer: coarse)").matches) return;
    card.addEventListener("mousemove", event => {
        if (window.innerWidth < 800) return;
        const rect = card.getBoundingClientRect();
        const rotateX = (event.clientY - rect.top - rect.height / 2) / 42;
        const rotateY = (rect.width / 2 - (event.clientX - rect.left)) / 42;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
}

function appendProjectLink(container, href, label) {
    if (!isSafeUrl(href)) return;
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "modal-project-link";
    link.textContent = label;
    container.appendChild(link);
}

function openProjectModal(projectId) {
    const project = projects.get(projectId);
    const modal = document.getElementById("projectModal");
    const box = modal?.querySelector(".modal-box");
    if (!project || !modal || !box) return;

    lastFocusedElement = document.activeElement;
    activeProjectId = projectId;
    document.getElementById("modalNumber").textContent = project.number;
    document.getElementById("modalCategory").textContent = project.category.toUpperCase();
    document.getElementById("modalTitle").textContent = project.title;
    document.getElementById("modalDescription").textContent = project.description;
    const tags = document.getElementById("modalTags");
    tags.replaceChildren();
    project.tags.forEach(tag => {
        const element = document.createElement("span");
        element.textContent = tag;
        tags.appendChild(element);
    });
    appendProjectLink(tags, project.github, "GitHub ↗");
    appendProjectLink(tags, project.liveUrl, "Live website ↗");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.getElementById("modalClose").focus();
}

function closeModal() {
    const modal = document.getElementById("projectModal");
    if (!modal?.classList.contains("active")) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    activeProjectId = null;
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function initialiseModal() {
    const modal = document.getElementById("projectModal");
    const closeButton = document.getElementById("modalClose");
    if (!modal || !closeButton) return;
    closeButton.addEventListener("click", closeModal);
    modal.addEventListener("click", event => {
        if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", event => {
        if (!modal.classList.contains("active")) return;
        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

async function enrichProjectsFromApi() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);
    try {
        const response = await fetch(API_URL, { signal: controller.signal, headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`Project API returned ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Project API returned an invalid response");

        const projectByTitle = new Map([...projects.values()].map(project => [project.title.toLowerCase(), project]));
        data.forEach(item => {
            const project = projectByTitle.get(String(item.name || "").trim().toLowerCase());
            if (!project) return;
            if (typeof item.description === "string" && item.description.trim()) project.description = item.description.trim();
            if (isSafeUrl(item.github)) project.github = item.github;
            if (isSafeUrl(item.live_url)) project.liveUrl = item.live_url;
        });
        document.documentElement.dataset.projectSource = "static-with-api-enrichment";
    } catch (error) {
        document.documentElement.dataset.projectSource = "static-fallback";
        console.warn("Project API unavailable; using built-in project catalogue.", error.message);
    } finally {
        window.clearTimeout(timeout);
    }
}

function initialiseCursorGlow() {
    const glow = document.querySelector(".cursor-glow");
    if (!glow || reduceMotion.matches || window.matchMedia("(pointer: coarse)").matches) return;
    let frame = null;
    let x = 0;
    let y = 0;
    document.addEventListener("mousemove", event => {
        x = event.clientX;
        y = event.clientY;
        if (frame) return;
        frame = requestAnimationFrame(() => {
            glow.style.transform = `translate(${x - 140}px, ${y - 140}px)`;
            frame = null;
        });
    }, { passive: true });
}

function initialiseHeader() {
    const header = document.querySelector(".header");
    if (!header) return;
    const update = () => header.classList.toggle("header-scrolled", window.scrollY > 50);
    window.addEventListener("scroll", update, { passive: true });
    update();
}

function initialiseProjectForm() {
    const form = document.getElementById("project-form");
    const status = document.getElementById("formStatus");
    if (!form || !status) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const values = new FormData(form);
        const subject = `Project enquiry from ${values.get("name")}`;
        const body = [
            `Name: ${values.get("name")}`,
            `Email: ${values.get("email")}`,
            `Company: ${values.get("company") || "Not provided"}`,
            `Service needed: ${values.get("service")}`,
            `Budget: ${values.get("budget") || "Not provided"}`,
            "",
            "Project details:",
            values.get("details")
        ].join("\n");
        status.textContent = "Opening your email application with your project details.";
        window.location.href = `mailto:lonerohan.cybersec@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

function initialiseApp() {
    document.documentElement.classList.add("js-enabled");
    initialiseMenu();
    initialiseReveal();
    initialiseCounters();
    initialiseTyping();
    initialiseProjects();
    initialiseFilters();
    initialiseModal();
    initialiseCursorGlow();
    initialiseHeader();
    initialiseProjectForm();
    enrichProjectsFromApi();
}

initialiseApp();
