// app.js
// ======================================
// Rebuild Gaza Projects Hub (Front-end)
// - renders projects cards
// - search + category filter
// - contribute form adds a new project
// - contact form demo
// - reads chosenCategory from localStorage (from home.html)
// ======================================

// -------------------------------
// DEMO PROJECTS DATA
// -------------------------------
let projects = [
  {
    id: "p1",
    title: "Repair Water Network",
    category: "water",
    area: "Gaza City",
    desc: "Fix broken pipelines and restore water access.",
    needs: ["plumbers", "logistics", "equipment"],
    status: "Urgent",
    trust: "Verified",
    progress: 45,
    lastUpdate: "Updated 6 hours ago"
  },
  {
    id: "p2",
    title: "Temporary School Classrooms",
    category: "education",
    area: "Khan Younis",
    desc: "Setup safe temporary classrooms for children.",
    needs: ["teachers", "IT support", "supplies"],
    status: "In progress",
    trust: "Pending",
    progress: 25,
    lastUpdate: "Updated yesterday"
  },
  {
    id: "p3",
    title: "Clinic Power Backup",
    category: "health",
    area: "Rafah",
    desc: "Install solar + backup power for a clinic.",
    needs: ["solar tech", "batteries", "engineer"],
    status: "Urgent",
    trust: "Verified",
    progress: 60,
    lastUpdate: "Updated 2 days ago"
  },
  {
    id: "p4",
    title: "Emergency Housing Repairs",
    category: "housing",
    area: "North Gaza",
    desc: "Repair damaged shelters and provide temporary housing support.",
    needs: ["construction team", "materials", "transport"],
    status: "In progress",
    trust: "Pending",
    progress: 15,
    lastUpdate: "Updated 3 days ago"
  }
];

// -------------------------------
// DOM ELEMENTS
// -------------------------------
const grid = document.getElementById("projectsGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");

const projectForm = document.getElementById("projectForm");
const contactForm = document.getElementById("contactForm");
const contactMsg = document.getElementById("contactMsg");
const yearEl = document.getElementById("year");

// -------------------------------
// HELPERS
// -------------------------------
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeNeeds(needsStr) {
  return (needsStr || "")
    .split(",")
    .map(x => x.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function getBadgeStatusHTML(status) {
  if (!status) return "";
  if (status.toLowerCase() === "urgent") return `<span class="badge urgent">Urgent</span>`;
  return `<span class="badge">${escapeHTML(status)}</span>`;
}

function getBadgeTrustHTML(trust) {
  if (!trust) return "";
  if (trust.toLowerCase() === "verified") return `<span class="badge verified">Verified</span>`;
  return `<span class="badge pending">${escapeHTML(trust)}</span>`;
}

// -------------------------------
// RENDER PROJECTS
// -------------------------------
function renderProjects(list) {
  if (!grid) return;

  grid.innerHTML = "";

  if (!list || list.length === 0) {
    grid.innerHTML = `<p class="muted center">No projects found.</p>`;
    return;
  }

  list.forEach((p) => {
    const needsTags = (p.needs || [])
      .slice(0, 3)
      .map(n => `<span class="badge">${escapeHTML(n)}</span>`)
      .join("");

    const safeTitle = escapeHTML(p.title);
    const safeArea = escapeHTML(p.area);
    const safeCategory = escapeHTML(p.category || "").toUpperCase();
    const safeUpdate = escapeHTML(p.lastUpdate || "Recently updated");
    const safeProgress = Number.isFinite(p.progress) ? p.progress : 0;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${safeTitle}</h3>
      <div class="meta">${safeArea} • ${safeCategory}</div>

      <div class="badges">
        ${getBadgeStatusHTML(p.status)}
        ${getBadgeTrustHTML(p.trust)}
      </div>

      <div class="progress">
        <div style="width:${Math.max(0, Math.min(100, safeProgress))}%;"></div>
      </div>

      <div class="small">Progress: ${Math.max(0, Math.min(100, safeProgress))}% • ${safeUpdate}</div>

      <div class="badges" style="margin-top:12px;">
        ${needsTags}
      </div>
    `;

    grid.appendChild(card);
  });
}

// -------------------------------
// FILTERING
// -------------------------------
function filterProjects() {
  const search = (searchInput?.value || "").toLowerCase();
  let category = categorySelect?.value || "all";

  // Récupérer le domaine choisi depuis localStorage si défini
  const chosen = localStorage.getItem("chosenCategory");
  if (chosen) {
    category = chosen;
    localStorage.removeItem("chosenCategory"); // on efface après usage
    if (categorySelect) categorySelect.value = category;
  }

  const filtered = projects.filter((p) => {
    const haystack =
      `${p.title} ${p.area} ${p.desc} ${(p.needs || []).join(" ")}`.toLowerCase();

    const matchesSearch = haystack.includes(search);
    const matchesCategory = category === "all" || p.category === category;

    // ✅ Ajouter le filtre "verified only"
    const isVerified = (p.trust || "").toLowerCase() === "verified";

    return matchesSearch && matchesCategory && isVerified;
  });

  renderProjects(filtered);
}

// -------------------------------
// CONTRIBUTE FORM (ADD PROJECT)
// -------------------------------
if (projectForm) {
  projectForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new FormData(projectForm);

    const title = (data.get("title") || "").toString().trim();
    const category = (data.get("category") || "").toString().trim();
    const area = (data.get("area") || "").toString().trim();
    const desc = (data.get("desc") || "").toString().trim();
    const needs = normalizeNeeds(data.get("needs"));

    if (!title || !category || !area || !desc) return;

    const newProject = {
      id: `p_${Date.now()}`,
      title,
      category,
      area,
      desc,
      needs,
      status: "Pending",
      trust: "Pending",
      progress: 0,
      lastUpdate: "Just submitted"
    };

    // Add to top
    projects.unshift(newProject);

    // Reset + re-render
    projectForm.reset();
    filterProjects();

    // Go to projects section
    window.location.hash = "projects";
  });
}

// -------------------------------
// CONTACT FORM (DEMO)
// -------------------------------
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (contactMsg) {
      contactMsg.textContent = "✅ Message sent! (demo)";
      contactMsg.style.color = "green";
    }

    contactForm.reset();

    setTimeout(() => {
      if (contactMsg) contactMsg.textContent = "";
    }, 2500);
  });
}

// -------------------------------
// EVENTS: SEARCH + CATEGORY
// -------------------------------
if (searchInput) searchInput.addEventListener("input", filterProjects);
if (categorySelect) categorySelect.addEventListener("change", filterProjects);

// -------------------------------
// FOOTER YEAR
// -------------------------------
if (yearEl) yearEl.textContent = new Date().getFullYear();

// -------------------------------
// APPLY CHOSEN CATEGORY FROM home.html
// (home.js stores localStorage chosenCategory)
// -------------------------------
const chosen = localStorage.getItem("chosenCategory");
if (chosen && categorySelect) {
  categorySelect.value = chosen;
  localStorage.removeItem("chosenCategory");
}

// -------------------------------
// INITIAL RENDER
// -------------------------------
filterProjects();