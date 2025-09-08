const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("navbar");
const closeBtn = document.getElementById("close-btn");

// open menu
menuToggle.addEventListener("click", () => {
  nav.classList.add("active");
});

// close menu with X
closeBtn.addEventListener("click", () => {
  nav.classList.remove("active");
});

// close menu when clicking outside
document.addEventListener("click", (event) => {
  if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
    nav.classList.remove("active");
  }
});
