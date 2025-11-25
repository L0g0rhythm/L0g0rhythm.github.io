/* FILE: js/components/renderer.js */

const DOM_CONFIG = {
  IDS: {
    PROFILE_IMG: "profile-img",
    PROFILE_IMG_ABOUT: "profile-img-about",
    ABOUT_CONTAINER: "about-container",
    ABOUT_TEXT_TARGET: "about-text-target",
    SOCIAL_DOCK_TARGET: "social-dock-target",
    SERVICES_CONTAINER: "services-container",
    PROJECTS_CONTAINER: "projects-container",
    SOCIAL_CONTAINER: "social-container",
    SOCIAL_CONTAINER_ABOUT: "social-container-about",
  },
  CLASSES: {
    LOADED: "loaded",
    SERVICE_CARD: "service-card glass-panel",
    PROJECT_ROW: "project-row glass-panel",
    DOCK_ICON: "dock-icon",
    SOCIAL_LINK: "social-link",
    VISIBLE: "in-view",
    PROJECT_INFO: "project-info",
    PROJECT_HEADER: "project-header",
    PROJECT_TITLE: "project-title",
    TECH_STACK: "tech-stack",
    TECH_BADGE: "tech-badge",
    PROJECT_DESC: "project-desc",
    PROJECT_LINK: "project-link",
    SERVICE_ICON_WRAPPER: "service-icon-wrapper",
    SERVICE_CONTENT: "service-content",
    CARD_HEADER: "card-header",
    STATUS_DOT: "status-dot",
    CARD_BODY: "card-body",
    CORNER_BRACKET: "corner-bracket",
    SPEC_ITEM: "spec-item",
    SPEC_LABEL: "spec-label",
    SPEC_VALUE: "spec-value",
    SPEC_ICON: "spec-icon",
    ABOUT_VISUAL: "about-visual",
    PILOT_CARD: "pilot-card",
    PILOT_PHOTO: "pilot-photo",
    PILOT_STATUS: "pilot-status",
    ABOUT_DATA: "about-data",
    BIO_TEXT: "bio-text",
    SPECS_TITLE: "specs-title",
    SPECS_GRID: "specs-grid",
    SOCIAL_DOCK_CONTAINER: "social-dock-container",
    SOCIAL_DOCK_LABEL: "social-dock-label",
    SOCIAL_DOCK: "social-dock",
  },
};

/**
 * Main Entry point to render profile data.
 * @param {Object} data - The full data object loaded from JSON.
 */
export function renderProfile(data) {
  if (!data) {
    console.error("[Renderer] Critical: No data provided.");
    return;
  }

  try {
    if (data.profile) updateProfileImage(data.profile);
    if (data.about && data.profile)
      renderAboutSection(data.about, data.profile, data.socials);

    if (Array.isArray(data.services)) renderServices(data.services);
    if (Array.isArray(data.projects)) renderProjects(data.projects);
    if (Array.isArray(data.socials)) renderFooterSocials(data.socials);

    // FAIL-SAFE VISIBILITY CHECK
    // Logic: If the global observer is ready, use it. Otherwise, force visibility to prevent black screen.
    if (window.observeElements) {
      setTimeout(window.observeElements, 100);
    } else {
      forceRevealElements();
    }
  } catch (error) {
    console.error("[Renderer] Runtime Error during rendering:", error);
  }
}

/**
 * Forces elements to be visible if the intersection observer fails.
 */
function forceRevealElements() {
  console.warn(
    "[Renderer] Animation Observer not ready. Forcing visibility fallback."
  );
  const selector = ".service-card, .project-row, .spec-item, .bio-text";
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add(DOM_CONFIG.CLASSES.VISIBLE);
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });
}

/**
 * Updates profile images safely.
 * @param {Object} profileData
 */
function updateProfileImage(profileData) {
  if (!profileData?.pictureUrl) return;

  const ids = [DOM_CONFIG.IDS.PROFILE_IMG, DOM_CONFIG.IDS.PROFILE_IMG_ABOUT];

  ids.forEach((id) => {
    const img = document.getElementById(id);
    if (img) {
      // Event listener for smooth loading
      img.onload = () => img.classList.add(DOM_CONFIG.CLASSES.LOADED);
      img.src = profileData.pictureUrl;
      // Text content is safe in attributes
      img.alt = profileData.name || "Profile";
    }
  });
}

/**
 * Renders the About section using DOM construction.
 * Refactored to remove innerHTML vulnerabilities.
 */
function renderAboutSection(aboutData, profileData, socialsData) {
  const container = document.getElementById(DOM_CONFIG.IDS.ABOUT_CONTAINER);
  if (!container) return;

  container.innerHTML = ""; // Clean slate

  // --- 1. Visual Column Construction ---
  const visualCol = document.createElement("div");
  visualCol.className = DOM_CONFIG.CLASSES.ABOUT_VISUAL;

  const pilotCard = document.createElement("div");
  pilotCard.className = DOM_CONFIG.CLASSES.PILOT_CARD;

  const img = document.createElement("img");
  img.src = profileData.pictureUrl;
  img.alt = "Pilot";
  img.className = DOM_CONFIG.CLASSES.PILOT_PHOTO;
  img.id = DOM_CONFIG.IDS.PROFILE_IMG_ABOUT;

  const pilotStatus = document.createElement("div");
  pilotStatus.className = DOM_CONFIG.CLASSES.PILOT_STATUS;

  const statusSpan1 = document.createElement("span");
  statusSpan1.textContent = "STATUS: ONLINE";
  const statusSpan2 = document.createElement("span");
  statusSpan2.textContent = "LVL: MAX";

  pilotStatus.append(statusSpan1, statusSpan2);
  pilotCard.append(img, pilotStatus);
  visualCol.appendChild(pilotCard);

  // --- 2. Data Column Construction ---
  const dataCol = document.createElement("div");
  dataCol.className = DOM_CONFIG.CLASSES.ABOUT_DATA;

  const h2 = document.createElement("h2");
  const accentSpan = document.createElement("span");
  accentSpan.className = "accent";
  accentSpan.textContent = "//";
  h2.appendChild(accentSpan);
  h2.appendChild(document.createTextNode(" WHO AM I"));

  const bioP = document.createElement("p");
  bioP.className = DOM_CONFIG.CLASSES.BIO_TEXT;
  bioP.id = DOM_CONFIG.IDS.ABOUT_TEXT_TARGET;

  const specsTitle = document.createElement("span");
  specsTitle.className = DOM_CONFIG.CLASSES.SPECS_TITLE;
  specsTitle.textContent = aboutData.interests_title || "SYSTEM MODULES";

  const specsGrid = document.createElement("div");
  specsGrid.className = DOM_CONFIG.CLASSES.SPECS_GRID;

  (aboutData.interests_list || []).forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = DOM_CONFIG.CLASSES.SPEC_ITEM;

    const divWrapper = document.createElement("div");

    const labelSpan = document.createElement("span");
    labelSpan.className = DOM_CONFIG.CLASSES.SPEC_LABEL;
    labelSpan.textContent = "MODULE";

    const valueSpan = document.createElement("span");
    valueSpan.className = DOM_CONFIG.CLASSES.SPEC_VALUE;
    valueSpan.textContent = item.text || ""; // Safe text insertion

    divWrapper.append(labelSpan, valueSpan);

    const iconSpan = document.createElement("span");
    iconSpan.className = DOM_CONFIG.CLASSES.SPEC_ICON;
    iconSpan.textContent = item.emoji || "";

    itemDiv.append(divWrapper, iconSpan);
    specsGrid.appendChild(itemDiv);
  });

  // --- 3. Social Dock ---
  const dockContainer = document.createElement("div");
  dockContainer.className = DOM_CONFIG.CLASSES.SOCIAL_DOCK_CONTAINER;

  const dockLabel = document.createElement("span");
  dockLabel.className = DOM_CONFIG.CLASSES.SOCIAL_DOCK_LABEL;
  dockLabel.textContent = "ESTABLISH CONNECTION";

  const dock = document.createElement("div");
  dock.className = DOM_CONFIG.CLASSES.SOCIAL_DOCK;
  dock.id = DOM_CONFIG.IDS.SOCIAL_DOCK_TARGET;

  dockContainer.append(dockLabel, dock);
  dataCol.append(h2, bioP, specsTitle, specsGrid, dockContainer);
  container.append(visualCol, dataCol);

  // Initialize TypeWriter Effect securely
  if (window.initTypeWriter) {
    window.initTypeWriter(aboutData.main_text, bioP, 20);
  } else {
    bioP.textContent = aboutData.main_text;
  }

  // Append Social Icons
  if (Array.isArray(socialsData)) {
    dock.appendChild(
      createSocialLinksFragment(socialsData, DOM_CONFIG.CLASSES.DOCK_ICON)
    );
  }
}

/**
 * Renders Services cards using DocumentFragment for performance.
 */
function renderServices(services) {
  const container = document.getElementById(DOM_CONFIG.IDS.SERVICES_CONTAINER);
  if (!container) return;

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  services.forEach((s) => {
    const article = document.createElement("article");
    article.className = DOM_CONFIG.CLASSES.SERVICE_CARD;

    // Icon Wrapper
    const iconWrapper = document.createElement("div");
    iconWrapper.className = DOM_CONFIG.CLASSES.SERVICE_ICON_WRAPPER;
    const i = document.createElement("i");
    i.className = s.iconClass; // Class names are generally trusted, assuming local JSON
    iconWrapper.appendChild(i);

    // Content Wrapper
    const content = document.createElement("div");
    content.className = DOM_CONFIG.CLASSES.SERVICE_CONTENT;

    // Header
    const header = document.createElement("div");
    header.className = DOM_CONFIG.CLASSES.CARD_HEADER;

    const h3 = document.createElement("h3");
    h3.textContent = s.title; // Safe

    const statusDot = document.createElement("div");
    statusDot.className = DOM_CONFIG.CLASSES.STATUS_DOT;

    header.append(h3, statusDot);

    // Body
    const body = document.createElement("p");
    body.className = DOM_CONFIG.CLASSES.CARD_BODY;
    body.textContent = s.description; // Safe

    content.append(header, body);

    // Corner Bracket (Decorative)
    const bracket = document.createElement("div");
    bracket.className = DOM_CONFIG.CLASSES.CORNER_BRACKET;

    article.append(iconWrapper, content, bracket);
    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}

/**
 * Renders Projects using robust DOM creation.
 */
function renderProjects(projects) {
  const container = document.getElementById(DOM_CONFIG.IDS.PROJECTS_CONTAINER);
  if (!container) return;

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  projects.forEach((p) => {
    const article = document.createElement("article");
    article.className = DOM_CONFIG.CLASSES.PROJECT_ROW;

    // Project Info
    const info = document.createElement("div");
    info.className = DOM_CONFIG.CLASSES.PROJECT_INFO;

    const header = document.createElement("div");
    header.className = DOM_CONFIG.CLASSES.PROJECT_HEADER;

    const h3 = document.createElement("h3");
    h3.className = DOM_CONFIG.CLASSES.PROJECT_TITLE;
    h3.textContent = p.title; // Safe

    header.appendChild(h3);
    info.appendChild(header);

    // Tech Stack Badges
    if (p.tags && Array.isArray(p.tags)) {
      const stack = document.createElement("div");
      stack.className = DOM_CONFIG.CLASSES.TECH_STACK;

      p.tags.forEach((t) => {
        const sp = document.createElement("span");
        sp.className = DOM_CONFIG.CLASSES.TECH_BADGE;
        sp.textContent = t; // Safe
        stack.appendChild(sp);
      });
      info.appendChild(stack);
    }

    // Description
    const desc = document.createElement("p");
    desc.className = DOM_CONFIG.CLASSES.PROJECT_DESC;
    desc.textContent = p.description; // Safe

    // Link Button
    const link = document.createElement("a");
    link.href = p.repoUrl; // Potential check: Valid URL scheme
    link.className = DOM_CONFIG.CLASSES.PROJECT_LINK;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // Construct inner Text + Icon for link safely
    link.appendChild(document.createTextNode("ACCESS_REPO "));
    const icon = document.createElement("i");
    icon.className = "fas fa-code-branch";
    link.appendChild(icon);

    article.append(info, desc, link);
    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}

/**
 * Creates a DocumentFragment for social links.
 * Highly optimized for reuse.
 */
function createSocialLinksFragment(socials, cssClass) {
  const fragment = document.createDocumentFragment();
  socials.forEach((s) => {
    const a = document.createElement("a");
    a.className = cssClass;
    a.href = s.url;
    a.setAttribute("aria-label", s.name);

    if (s.url && !s.url.startsWith("mailto:")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    const i = document.createElement("i");
    i.className = s.iconClass;
    a.appendChild(i);
    fragment.appendChild(a);
  });
  return fragment;
}

/**
 * Renders footer social icons.
 */
function renderFooterSocials(socials) {
  [
    DOM_CONFIG.IDS.SOCIAL_CONTAINER,
    DOM_CONFIG.IDS.SOCIAL_CONTAINER_ABOUT,
  ].forEach((id) => {
    const c = document.getElementById(id);
    if (c) {
      c.innerHTML = "";
      c.appendChild(
        createSocialLinksFragment(
          socials,
          id === DOM_CONFIG.IDS.SOCIAL_CONTAINER
            ? DOM_CONFIG.CLASSES.SOCIAL_LINK
            : DOM_CONFIG.CLASSES.DOCK_ICON
        )
      );
    }
  });
}

/**
 * Utility: Escapes text (Legacy/Fallback).
 * Note: Since we switched to textContent, this is strictly a utility for edge cases.
 */
function escapeText(str) {
  if (!str) return "";
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        m
      ])
  );
}

// Placeholder for future implementation
export function renderTabContent(tabId, allData) {
  // Logic not yet implemented or not required by current specs.
}

/**
 * Global TypeWriter effect attached to window for accessibility from other modules.
 * Refactored to prevent memory leaks by clearing previous timeouts.
 */
window.initTypeWriter = function (text, element, speed) {
  if (!element) return;

  // Clear any existing interval on this element to prevent collision
  if (element.dataset.typeWriterId) {
    clearTimeout(parseInt(element.dataset.typeWriterId));
  }

  let i = 0;
  element.textContent = "";

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      const timerId = setTimeout(type, speed);
      element.dataset.typeWriterId = timerId.toString();
    } else {
      delete element.dataset.typeWriterId;
    }
  }
  type();
};
