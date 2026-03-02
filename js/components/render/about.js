/* FILE: js/components/render/about.js */

import { DOM_CONFIG } from "./renderConfig.js";

/**
 * Renders the About section — compact single-viewport layout without
 * photo or social dock (contacts are in the Hero section).
 */
export function renderAboutSection(aboutData, profileData, socialsData) {
  const container = document.getElementById(DOM_CONFIG.IDS.ABOUT_CONTAINER);
  if (!container) return;

  container.innerHTML = "";

  // Single column — no visual/photo column
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

  dataCol.append(h2, bioP, specsTitle, specsGrid);
  container.appendChild(dataCol);

  // TypeWriter Effect — instant on revisit
  if (window.initTypeWriter) {
    window.initTypeWriter(aboutData.main_text, bioP, 20);
  } else {
    bioP.textContent = aboutData.main_text;
  }
}
