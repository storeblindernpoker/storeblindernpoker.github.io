function togglePopup(id) {
    const popup = document.getElementById(id);
    if (popup.style.display === "flex") {
        popup.style.display = "none";
    } else {
        popup.style.display = "flex";
    }
}

// Close popup if user clicks outside of the content box
window.onclick = function(event) {
    if (event.target.className === 'popup-overlay') {
        event.target.style.display = "none";
    }
}
