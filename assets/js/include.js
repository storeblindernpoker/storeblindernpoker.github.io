// Load navbar.html into #navbar-container
document.addEventListener("DOMContentLoaded", () => {
  fetch("/navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar-container").innerHTML = data;
    });
});