/* FILE: js/components/render/profile.js */

import { renderAboutSection } from "./about.js";
import { updateProfileImage } from "./profileImage.js";
import { renderProjects } from "./projects.js";
import { DOM_CONFIG } from "./renderConfig.js";
import { renderServices } from "./services.js";
import { renderFooterSocials } from "./socialLinks.js";

/**
 * Main orchestrator: distributes data to specialized sub-renderers.
 */
export function renderProfile(data) {
  if (!data) {
    console.error("[Renderer] Critical: No data provided.");
    return;
  }

  try {
    if (data.profile) updateProfileImage(data.profile);
    if (data.about && data.profile)
      renderAboutSection(data.about, data.profile);

    if (Array.isArray(data.services)) renderServices(data.services);
    if (Array.isArray(data.projects)) renderProjects(data.projects);
    if (Array.isArray(data.socials)) renderFooterSocials(data.socials);

    // Fail-safe: force visibility if observer is not ready
    if (window.observeElements) {
      setTimeout(window.observeElements, 100);
    } else {
      forceRevealElements();
    }
  } catch (error) {
    console.error("[Renderer] Runtime Error:", error);
  }
}

function forceRevealElements() {
  console.warn("[Renderer] Observer not ready. Forcing visibility fallback.");
  document
    .querySelectorAll(".service-card, .project-row, .spec-item, .bio-text")
    .forEach((el) => {
      el.classList.add(DOM_CONFIG.CLASSES.VISIBLE);
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
}
