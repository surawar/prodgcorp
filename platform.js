"use strict";

const catalogue = window.PRODG_CATALOG || { courses: [], videos: [], projects: [] };
const detailUrl = item => `detail.html?type=${item.type}&id=${item.id}`;

function findItem(type, title) {
    const item = catalogue[type].find(entry => entry.title === title);
    return item && { ...item, type };
}

function prepareCard(element, item) {
    if (!element || !item) return;
    element.classList.add("platform-card");
    element.dataset.catalogueType = item.type;
    element.dataset.catalogueId = item.id;
    element.tabIndex = 0;
    element.setAttribute("role", "link");
    element.setAttribute("aria-label", `${item.title} — coming soon`);
    const action = element.matches("a") ? element : element.querySelector("a, .video-copy b, .build-feature-copy > a");
    if (action?.tagName === "A") {
        action.href = detailUrl(item);
        action.textContent = "Coming soon";
        action.classList.add("coming-soon-action");
    }
    if (!element.querySelector(".coming-soon-badge")) {
        const badge = document.createElement("span");
        badge.className = "coming-soon-badge";
        badge.textContent = "COMING SOON";
        element.append(badge);
    }
    const open = event => {
        if (event.target.closest("a") && event.type === "click") return;
        window.location.href = detailUrl(item);
    };
    element.addEventListener("click", open);
    element.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(event); }
    });
}

function addSearch(section, type, cards) {
    if (!section || !cards.length) return;
    const filters = type === "courses"
        ? [["all", "All"], ["beginner", "Beginner"], ["intermediate", "Intermediate"]]
        : [["all", "All"], ["web app", "Web apps"], ["source resources", "Resources"]];
    const toolbar = document.createElement("div");
    toolbar.className = "catalogue-toolbar reveal visible";
    toolbar.innerHTML = `<label><span>Search ${type}</span><input type="search" placeholder="Search ${type}..." aria-label="Search ${type}"></label><div class="catalogue-filters" aria-label="${type} filters">${filters.map(([value, label], index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-filter="${value}">${label}</button>`).join("")}</div><p class="catalogue-empty" hidden>No coming-soon items match that search.</p>`;
    section.querySelector(".section-intro")?.after(toolbar);
    const input = toolbar.querySelector("input");
    const buttons = [...toolbar.querySelectorAll("button")];
    let filter = "all";
    const update = () => {
        const term = input.value.trim().toLowerCase();
        let visible = 0;
        cards.forEach(card => {
            const item = findItem(type, card.querySelector("h3")?.textContent.trim() || "");
            const matchesTerm = !term || `${item?.title} ${item?.summary} ${item?.tags?.join(" ") || ""}`.toLowerCase().includes(term);
            const matchesFilter = filter === "all" || item?.level?.toLowerCase() === filter || item?.category?.toLowerCase() === filter;
            card.hidden = !(matchesTerm && matchesFilter);
            if (!card.hidden) visible += 1;
        });
        toolbar.querySelector(".catalogue-empty").hidden = visible !== 0;
    };
    input.addEventListener("input", update);
    buttons.forEach(button => button.addEventListener("click", () => {
        filter = button.dataset.filter;
        buttons.forEach(item => item.classList.toggle("active", item === button));
        update();
    }));
}

function initialiseHomePlatform() {
    const courseCards = [...document.querySelectorAll(".course-card")];
    courseCards.forEach(card => prepareCard(card, findItem("courses", card.querySelector("h3")?.textContent.trim() || "")));
    addSearch(document.querySelector(".course-section"), "courses", courseCards);

    const videos = [document.querySelector(".video-feature"), ...document.querySelectorAll(".video-list a")];
    videos.forEach(card => prepareCard(card, findItem("videos", card.querySelector("h3")?.textContent.trim() || "")));

    const projectCards = [document.querySelector(".build-feature"), ...document.querySelectorAll(".build-resource-list a")];
    projectCards.forEach(card => prepareCard(card, findItem("projects", card.querySelector("h3")?.textContent.trim() || "")));
    addSearch(document.querySelector(".build-section"), "projects", projectCards);
}

function initialiseDetailPage() {
    const root = document.querySelector("[data-detail-root]");
    if (!root) return;
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const item = catalogue[type]?.find(entry => entry.id === params.get("id"));
    if (!item) { root.innerHTML = '<p class="detail-kicker">NOT FOUND</p><h1>That item is not in the catalogue.</h1><a class="btn btn-primary" href="index.html">Return home</a>'; return; }
    const tags = (item.tags || [item.category, item.level]).filter(Boolean).map(tag => `<span>${tag}</span>`).join("");
    root.innerHTML = `<p class="detail-kicker">${type.slice(0, -1).toUpperCase()} / COMING SOON</p><div class="detail-status">COMING SOON</div><h1>${item.title}</h1><p class="detail-summary">${item.summary}</p><div class="detail-tags">${tags}</div><div class="detail-note"><b>On the way</b><p>This placeholder detail page is ready for real lessons, video playback, project briefs, source links, and progress tracking when they are available.</p></div><a class="btn btn-primary" href="index.html#${type === "projects" ? "build" : "learn"}">Back to ${type === "projects" ? "Build" : "Learn"} <span>→</span></a>`;
    document.title = `${item.title} | ProDG Corp`;
}

document.addEventListener("DOMContentLoaded", () => { initialiseHomePlatform(); initialiseDetailPage(); });
