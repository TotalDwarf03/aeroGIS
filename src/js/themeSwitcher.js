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

  loadHomepageMap();
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
