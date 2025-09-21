document.addEventListener("DOMContentLoaded", () => {
  const headerURL = "header.html";   // relative
  const footerURL = "footer.html";   // relative

  fetch(headerURL)
    .then(r => {
      if (!r.ok) throw new Error("Header fetch failed");
      return r.text();
    })
    .then(html => {
      const container = document.getElementById("site-header");
      if (!container) return;
      container.innerHTML = html;

      // Fix logo path (relative)
      const logo = container.querySelector(".brand img");
      if (logo && !logo.src.includes("http")) {
        logo.src = "images/logo.png";
      }

      // Highlight current page
      const current = window.location.pathname.replace(/\/$/, "");
      container.querySelectorAll(".nav-links a").forEach(a => {
        const linkPath = new URL(a.href).pathname.replace(/\/$/, "");
        if (linkPath === current) a.classList.add("active");
      });
    })
    .catch(err => console.error(err));

  fetch(footerURL)
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

  document.addEventListener("click", e => {
    if (e.target.closest(".menu-toggle")) {
      const mobileNav = document.querySelector(".mobile-nav");
      if (mobileNav) mobileNav.classList.toggle("show");
    }
  });
});
