const darkModeIcon = "dark_mode";
const lightModeIcon = "light_mode";

const themeSwitcherIds = [
    { buttonId: "themeSwitcherDesktop", iconId: "themeSwitcherIconDesktop" },
    { buttonId: "themeSwitcherMobile", iconId: "themeSwitcherIconMobile" }
]

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);

    themeSwitcherIds.forEach(({ buttonId, iconId }) => {
        const themeSwitcherIcon = document.getElementById(iconId);
        if (newTheme === "dark") {
            themeSwitcherIcon.textContent = darkModeIcon;
        } else {
            themeSwitcherIcon.textContent = lightModeIcon;
        }
    });
}

// Initialize button text on page load
document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcherButton = document.getElementById("themeSwitcherDesktop");

    // For some reason, the button doesn't reflect the theme until clicked once
    // So we simulate a click to set it correctly - this is really stupid
    themeSwitcherButton.click();
});