/* FILE: js/components/render/profileImage.js */

import { DOM_CONFIG } from "./renderConfig.js";

/**
 * Updates profile images safely with smooth loading transition.
 */
export function updateProfileImage(profileData) {
  if (!profileData?.pictureUrl) return;

  const ids = [DOM_CONFIG.IDS.PROFILE_IMG, DOM_CONFIG.IDS.PROFILE_IMG_ABOUT];

  ids.forEach((id) => {
    const img = document.getElementById(id);
    if (img) {
      img.onload = () => img.classList.add(DOM_CONFIG.CLASSES.LOADED);
      img.src = profileData.pictureUrl;
      img.alt = profileData.name || "Profile";
    }
  });
}
