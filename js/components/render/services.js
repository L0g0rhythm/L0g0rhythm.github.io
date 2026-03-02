/* FILE: js/components/render/services.js */

import { DOM_CONFIG } from "./renderConfig.js";

/**
 * Renders Services cards using DocumentFragment for performance.
 */
export function renderServices(services) {
  const container = document.getElementById(DOM_CONFIG.IDS.SERVICES_CONTAINER);
  if (!container) return;

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  services.forEach((s) => {
    const article = document.createElement("article");
    article.className = DOM_CONFIG.CLASSES.SERVICE_CARD;

    const iconWrapper = document.createElement("div");
    iconWrapper.className = DOM_CONFIG.CLASSES.SERVICE_ICON_WRAPPER;
    const i = document.createElement("i");
    i.className = s.iconClass;
    iconWrapper.appendChild(i);

    const content = document.createElement("div");
    content.className = DOM_CONFIG.CLASSES.SERVICE_CONTENT;

    const header = document.createElement("div");
    header.className = DOM_CONFIG.CLASSES.CARD_HEADER;

    const h3 = document.createElement("h3");
    h3.textContent = s.title;

    const statusDot = document.createElement("div");
    statusDot.className = DOM_CONFIG.CLASSES.STATUS_DOT;

    header.append(h3, statusDot);

    const body = document.createElement("p");
    body.className = DOM_CONFIG.CLASSES.CARD_BODY;
    body.textContent = s.description;

    content.append(header, body);

    const bracket = document.createElement("div");
    bracket.className = DOM_CONFIG.CLASSES.CORNER_BRACKET;

    article.append(iconWrapper, content, bracket);
    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}
