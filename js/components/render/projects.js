/* FILE: js/components/render/projects.js */

import { DOM_CONFIG } from "./renderConfig.js";

/**
 * Renders Projects using robust DOM creation (no innerHTML).
 */
export function renderProjects(projects) {
  const container = document.getElementById(DOM_CONFIG.IDS.PROJECTS_CONTAINER);
  if (!container) return;

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  projects.forEach((p) => {
    const article = document.createElement("article");
    article.className = DOM_CONFIG.CLASSES.PROJECT_ROW;

    const info = document.createElement("div");
    info.className = DOM_CONFIG.CLASSES.PROJECT_INFO;

    const header = document.createElement("div");
    header.className = DOM_CONFIG.CLASSES.PROJECT_HEADER;

    const h3 = document.createElement("h3");
    h3.className = DOM_CONFIG.CLASSES.PROJECT_TITLE;
    h3.textContent = p.title;

    header.appendChild(h3);
    info.appendChild(header);

    if (p.tags && Array.isArray(p.tags)) {
      const stack = document.createElement("div");
      stack.className = DOM_CONFIG.CLASSES.TECH_STACK;

      p.tags.forEach((t) => {
        const sp = document.createElement("span");
        sp.className = DOM_CONFIG.CLASSES.TECH_BADGE;
        sp.textContent = t;
        stack.appendChild(sp);
      });
      info.appendChild(stack);
    }

    const desc = document.createElement("p");
    desc.className = DOM_CONFIG.CLASSES.PROJECT_DESC;
    desc.textContent = p.description;

    const link = document.createElement("a");
    link.href = p.repoUrl;
    link.className = DOM_CONFIG.CLASSES.PROJECT_LINK;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.appendChild(document.createTextNode("ACCESS_REPO "));
    const icon = document.createElement("i");
    icon.className = "fas fa-code-branch";
    link.appendChild(icon);

    article.append(info, desc, link);
    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}
