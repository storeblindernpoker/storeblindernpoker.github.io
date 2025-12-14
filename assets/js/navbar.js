function adjustMenu() {
    const nav = document.getElementById("contentTop");
    if (!nav) return;

    const items = Array.from(nav.querySelectorAll(".form-top"));
    if (items.length <= 1) return;

    const hamburger = items[0];
    const menuLinks = items.slice(1);
    const mobileMenu = document.getElementById("mobile-menu");

    // Reset for measurement
    hamburger.style.display = "none";
    menuLinks.forEach(el => {
        el.style.display = "inline-block";
        el.style.opacity = "1";
    });

    const available = nav.clientWidth;
    let used = 0;
    let needsHamburger = false;
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
    } else {
        // If hamburger isn't needed, close everything
        if (mobileMenu) mobileMenu.classList.remove("active");
        // NEW: Also reset the navbar background
        nav.classList.remove("menu-open");
        
        // Safety: Uncheck the burger input so it doesn't stay "checked" invisibly
        const burgerInput = document.getElementById("burger-toggle");
        if(burgerInput) burgerInput.checked = false;
    }
}

// --- THE FIX FOR INJECTED CONTENT ---

const container = document.getElementById('navbar-container');
if (container) {
    const observer = new MutationObserver((mutations) => {
        if (container.children.length > 0) {
            
            // Step 0: Hide Current Page Link (Your existing logic)
            let currentPage = window.location.pathname.split("/").pop();
            if (currentPage === "") currentPage = "index.html";
            const topLinks = container.querySelectorAll('.top-a');
            topLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    const formContainer = link.closest('.form-top');
                    if (formContainer) formContainer.remove();
                }
            });
            const mobileLinks = container.querySelectorAll('.mobile-menu a');
            mobileLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.remove();
                }
            });

            // 1. Run sizing logic
            adjustMenu();

            // 2. Logic for the Checkbox Hamburger + Navbar Background
            const burgerInput = document.getElementById("burger-toggle");
            const mobileMenu = document.getElementById("mobile-menu");
            const nav = document.getElementById("contentTop"); // Get the nav element

            if (burgerInput && mobileMenu && nav) {
                const newInput = burgerInput.cloneNode(true);
                burgerInput.parentNode.replaceChild(newInput, burgerInput);

                newInput.addEventListener("change", function() {
                    if (this.checked) {
                        mobileMenu.classList.add("active");
                        // NEW: Make navbar background dark
                        nav.classList.add("menu-open");
                    } else {
                        mobileMenu.classList.remove("active");
                        // NEW: Revert navbar background
                        nav.classList.remove("menu-open");
                    }
                });
            }
        }
    });

    observer.observe(container, { childList: true });
}

window.addEventListener("resize", adjustMenu);
window.addEventListener("pageshow", (event) => {
    if (event.persisted) adjustMenu();
});