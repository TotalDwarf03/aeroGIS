const darkModeIcon = "dark_mode";
const lightModeIcon = "light_mode";

const themeSwitcherIds = [
  { buttonId: "themeSwitcherDesktop", iconId: "themeSwitcherIconDesktop" },
  { buttonId: "themeSwitcherMobile", iconId: "themeSwitcherIconMobile" },
];

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme");
}

function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  sessionStorage.setItem("theme", newTheme);

  themeSwitcherIds.forEach(({ buttonId, iconId }) => {
    const themeSwitcherIcon = document.getElementById(iconId);
    if (newTheme === "dark") {
      themeSwitcherIcon.textContent = darkModeIcon;
    } else {
      themeSwitcherIcon.textContent = lightModeIcon;
    }
  });

  // This does not toggle the Google Map theme because you can only set it at initialization.
  // See: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.colorScheme
  // I could make a workaround for this by re-initializing the map on theme change, but I don't want to
  // spend time on that right now.
}

// Initialize button text on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = sessionStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  themeSwitcherIds.forEach(({ buttonId, iconId }) => {
    const themeSwitcherIcon = document.getElementById(iconId);
    if (savedTheme === "dark") {
      themeSwitcherIcon.textContent = darkModeIcon;
    } else {
      themeSwitcherIcon.textContent = lightModeIcon;
    }
  });
});
