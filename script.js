document.addEventListener("DOMContentLoaded", () => {
  // --- Detect how many folders deep we are ---
  // e.g.  /index.html  -> depth 0
  //       /subpage/announcement.html -> depth 1
  const depth = window.location.pathname
    .split("/")
    .filter(Boolean).length - 1;

  // prefix for all internal fetches/links
  const prefix = depth > 0 ? "../".repeat(depth) : "";

  // ---- HEADER ----
  fetch(prefix + "header.html")
    .then(r => {
      if (!r.ok) throw new Error("Header fetch failed");
      return r.text();
    })
    .then(html => {
      const container = document.getElementById("site-header");
      if (!container) return;
      container.innerHTML = html;

      // fix logo path
      const logo = container.querySelector(".brand img");
      if (logo) logo.src = prefix + "images/logo.png";

      // fix all internal nav links so they work from /subpage/*
      container.querySelectorAll(".nav-links a, .mobile-nav a").forEach(a => {
        const href = a.getAttribute("href");
        if (href && !href.startsWith("http") && !href.startsWith("#")) {
          a.setAttribute("href", prefix + href);
        }
      });

      // highlight current page
      const current = window.location.pathname.replace(/\/$/, "");
      container.querySelectorAll(".nav-links a").forEach(a => {
        const linkPath = new URL(a.href).pathname.replace(/\/$/, "");
        if (linkPath === current) a.classList.add("active");
      });
    })
    .catch(err => console.error(err));

  // ---- FOOTER ----
  fetch(prefix + "footer.html")
    .then(r => {
      if (!r.ok) throw new Error("Footer fetch failed");
      return r.text();
    })
    .then(html => {
      const container = document.getElementById("site-footer");
      if (!container) return;
      container.innerHTML = html;
      const y = container.querySelector("#year");
      if (y) y.textContent = new Date().getFullYear();
    })
    .catch(err => console.error(err));

  // ---- MOBILE MENU ----
  document.addEventListener("click", e => {
    if (e.target.closest(".menu-toggle")) {
      const mobileNav = document.querySelector(".mobile-nav");
      if (mobileNav) mobileNav.classList.toggle("show");
    }
  });
});
