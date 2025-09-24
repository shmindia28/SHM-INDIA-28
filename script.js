document.addEventListener("DOMContentLoaded", () => {
  // ===== PATH PREFIX (for GitHub Pages depth) =====
  const parts = window.location.pathname.split("/").filter(Boolean);
  const depth = Math.max(parts.length - 2, 0);
  const prefix = depth > 0 ? "../".repeat(depth) : "";

  // ===== HEADER =====
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
      const logoImg = container.querySelector(".brand img");
      if (logoImg) logoImg.src = prefix + "images/logo.png";

      // fix logo link
      const logoLink = container.querySelector(".brand");
      if (logoLink) logoLink.href = prefix + "index.html";

      // fix nav links
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

  // ===== FOOTER =====
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

      // fix footer links
      container.querySelectorAll('a[href^="index"],a[href^="about"],a[href^="services"],a[href^="contact"]').forEach(a => {
        a.setAttribute("href", prefix + a.getAttribute("href"));
      });

      const footerLogo = container.querySelector(".footer-logo");
      if (footerLogo) footerLogo.src = prefix + "images/logo.png";
    })
    .catch(err => console.error(err));

  // ===== MOBILE MENU =====
  document.addEventListener("click", e => {
    if (e.target.closest(".menu-toggle")) {
      const mobileNav = document.querySelector(".mobile-nav");
      if (mobileNav) mobileNav.classList.toggle("show");
    }
  });

  // ===== SERVICE SLIDERS =====
  document.querySelectorAll(".service-slider").forEach(slider => {
    const folder = slider.dataset.folder;

    let ext = "png";
    let count = 0;
    switch (folder) {
      case "certificate":  count = 27; ext = "png"; break;
      case "sticker":      count = 27; ext = "png"; break;
      case "worksheet":    count = 27; ext = "png"; break;
      case "announcement": count = 27; ext = "jpg"; break;
      case "socialposts":  count = 27; ext = "png"; break;
      default: return;
    }

    const imgPrefix = prefix + "images/" + folder + "/";
    const nums = Array.from({ length: count }, (_, i) => i + 1);

    // shuffle order
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    const track = document.createElement("div");
    track.classList.add("track");

    // ---- Initial fast load (20 images) ----
    const initialCount = Math.min(20, nums.length);
    nums.slice(0, initialCount).forEach(n => {
      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = `${imgPrefix}${n}.${ext}`;
      img.alt = `${folder} sample ${n}`;
      track.appendChild(img);
    });

    // ---- Load remaining images after delay ----
    setTimeout(() => {
      nums.slice(initialCount).forEach(n => {
        const img = document.createElement("img");
        img.loading = "lazy";
        img.src = `${imgPrefix}${n}.${ext}`;
        img.alt = `${folder} sample ${n}`;
        track.appendChild(img);
      });

      // duplicate set for seamless infinite scroll
      nums.forEach(n => {
        const img = document.createElement("img");
        img.loading = "lazy";
        img.src = `${imgPrefix}${n}.${ext}`;
        img.alt = `${folder} sample ${n}`;
        track.appendChild(img);
      });
    }, 2000);

    slider.appendChild(track);
  });
});
