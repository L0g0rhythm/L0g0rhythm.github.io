/* FILE: js/components/render/socialLinks.js */

import { DOM_CONFIG } from "./renderConfig.js";

/**
 * Creates a DocumentFragment with social media link icons.
 * Reusable across about section dock and footer.
 */
export function createSocialLinksFragment(socials, cssClass) {
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
 * Renders footer social icons in designated containers.
 */
export function renderFooterSocials(socials) {
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
