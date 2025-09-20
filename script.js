<script>
document.addEventListener("DOMContentLoaded", () => {
  // ---- Detect if we're on GitHub Pages ----
  // GitHub Pages always serves pages from the repo root,
  // so we never need "../" prefixes there.
  const isGitHub = location.hostname.endsWith("github.io");

  // Calculate prefix only when running locally with real subfolders
  let prefix = "";
  if (!isGitHub) {
    const depth = window.location.pathname
      .split("/")
      .filter(Boolean).length - 1;
    prefix = depth > 0 ? "../".repeat(depth) : "";
  }

  // ---- HEADER ----
  fetch(prefix + "header.html")
    .then(res => {
      if (!res.ok) throw new Error("Header fetch failed");
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("site-header");
      if (!container) return;
      container.innerHTML = html;

      // Fix logo path for sub-pages
      const logo = container.querySelector(".brand img");
      if (logo && !logo.src.includes("http")) {
        logo.src = prefix + "images/logo.png";
      }

      // Prefix internal nav links
      container.querySelectorAll(".nav-links a, .mobile-nav a").forEach(a => {
        const href = a.getAttribute("href");
        if (href && !href.startsWith("http") && !href.startsWith("#")) {
          a.setAttribute("href", prefix + href);
        }
      });

      // Highlight current page link
      const current = location.pathname.replace(/\/$/, "");
      container.querySelectorAll(".nav-links a").forEach(a => {
        const linkPath = new URL(a.href).pathname.replace(/\/$/, "");
        if (linkPath === current) a.classList.add("active");
      });
    })
    .catch(err => console.error(err));

  // ---- FOOTER ----
  fetch(prefix + "footer.html")
    .then(res => {
      if (!res.ok) throw new Error("Footer fetch failed");
      return res.text();
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
</script>
