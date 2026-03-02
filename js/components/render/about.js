/* FILE: js/components/render/about.js */

import { DOM_CONFIG } from "./renderConfig.js";
import { createSocialLinksFragment } from "./socialLinks.js";

/**
 * Renders the About section using secure DOM construction (no innerHTML).
 */
export function renderAboutSection(aboutData, profileData, socialsData) {
  const container = document.getElementById(DOM_CONFIG.IDS.ABOUT_CONTAINER);
  if (!container) return;

  container.innerHTML = "";

  // 1. Visual Column (ID Card)
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

  // 2. Data Column
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
    valueSpan.textContent = item.text || "";

    divWrapper.append(labelSpan, valueSpan);

    const iconSpan = document.createElement("span");
    iconSpan.className = DOM_CONFIG.CLASSES.SPEC_ICON;
    iconSpan.textContent = item.emoji || "";

    itemDiv.append(divWrapper, iconSpan);
    specsGrid.appendChild(itemDiv);
  });

  // 3. Social Dock
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

  // TypeWriter Effect
  if (window.initTypeWriter) {
    window.initTypeWriter(aboutData.main_text, bioP, 20);
  } else {
    bioP.textContent = aboutData.main_text;
  }

  // Social Icons
  if (Array.isArray(socialsData)) {
    dock.appendChild(
      createSocialLinksFragment(socialsData, DOM_CONFIG.CLASSES.DOCK_ICON)
    );
  }
}
