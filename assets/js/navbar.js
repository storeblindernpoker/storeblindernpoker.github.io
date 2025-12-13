function adjustMenu() {
    const nav = document.getElementById("contentTop");
    // If the navbar isn't in the DOM yet, stop and wait
    if (!nav) return;

    const items = Array.from(nav.querySelectorAll(".form-top"));
    if (items.length === 0) return;

    const hamburger = items[0];
    const menuLinks = items.slice(1);

    // Reset for measurement
    hamburger.style.display = "none";
    menuLinks.forEach(el => {
        el.style.display = "inline-block";
        el.style.opacity = "1";
    });

    const available = nav.clientWidth;
    let used = 0;
    let needsHamburger = false;

    // Buffer for the hamburger icon width (approx 60px)
    const buffer = 100;

    for (let i = 0; i < menuLinks.length; i++) {
        used += menuLinks[i].offsetWidth;
        if (used > available - buffer) {
            menuLinks[i].style.display = "none";
            needsHamburger = true;
        }
    }

    if (needsHamburger) {
        hamburger.style.display = "inline-block";
        hamburger.style.opacity = "1";
    }
}

// --- THE FIX FOR INJECTED CONTENT ---

// 1. Watch the container for the navbar being added
const container = document.getElementById('navbar-container');
if (container) {
    const observer = new MutationObserver((mutations) => {
        // If content was added to the container, run adjustMenu
        if (container.children.length > 0) {
            adjustMenu();
            // Optional: stop watching once we've found it
            // observer.disconnect(); 
        }
    });

    observer.observe(container, { childList: true });
}

// 2. Keep these for normal behavior
window.addEventListener("resize", adjustMenu);
window.addEventListener("pageshow", (event) => {
    if (event.persisted) adjustMenu();
});