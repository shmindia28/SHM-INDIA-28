document.addEventListener("DOMContentLoaded", () => {
  // Detect how many folders below the REPO root we are.
  const parts = window.location.pathname.split("/").filter(Boolean);
  // first part is the repo name on GitHub Pages
  const depth = Math.max(parts.length - 2, 0);
  const prefix = depth > 0 ? "../".repeat(depth) : "";

  // ----- HEADER -----
  fetch(prefix + "header.html")
    .then(r => {
      if (!r.ok) throw new Error("Header fetch failed");
      return r.text();
    })
    .then(html => {
      const container = document.getElementById("site-header");
      if (!container) return;
      container.innerHTML = html;

      // fix logo image path
      const logoImg = container.querySelector(".brand img");
      if (logoImg) logoImg.src = prefix + "images/logo.png";

      // fix logo anchor (so it always points to repo root index.html)
      const logoLink = container.querySelector(".brand");
      if (logoLink) logoLink.href = prefix + "index.html";

      // fix all internal nav links
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

  // ----- FOOTER -----
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

      // fix footer logo and links too
      container.querySelectorAll('a[href^="index"],a[href^="about"],a[href^="services"],a[href^="contact"]').forEach(a => {
        a.setAttribute("href", prefix + a.getAttribute("href"));
      });
      const footerLogo = container.querySelector(".footer-logo");
      if (footerLogo) footerLogo.src = prefix + "images/logo.png";
    })
    .catch(err => console.error(err));

  // ----- MOBILE MENU -----
  document.addEventListener("click", e => {
    if (e.target.closest(".menu-toggle")) {
      const mobileNav = document.querySelector(".mobile-nav");
      if (mobileNav) mobileNav.classList.toggle("show");
    }
  });
});
