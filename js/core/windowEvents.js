/* FILE: js/core/windowEvents.js */

import { getCurrentView } from "./navigation.js";

/**
 * Tab visibility: changes title when user leaves/returns to tab.
 * Re-engagement pattern that draws attention back to the tab.
 */
export function initWindowEvents(pageTitles) {
  const altTitle = "⚠️ SIGNAL LOST // RECONNECT...";

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      document.title = altTitle;
    } else {
      document.title =
        pageTitles[getCurrentView()] || "L0g0rhythm | Architect";
    }
  });
}
