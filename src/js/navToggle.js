function navToggle() {
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("mobileNavLinks");

    navLinks.classList.toggle("show");
    navToggle.innerText = navLinks.classList.contains("show") ? "Collapse" : "Menu";

}
