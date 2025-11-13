/* Losers Content — nav toggle, smooth scroll, reveal on scroll, captcha, copy */

(function initLosersContentSite() {
  const doc = document;

  /* ---------------- NAV TOGGLE ---------------- */
  const navToggle = doc.querySelector(".nav-toggle");
  const navLinks = doc.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("show");
      document.body.classList.toggle("no-scroll", !expanded);
    });

    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");
      }
    });
  }

  /* ---------------- SMOOTH SCROLL ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  /* ---------------- REVEAL ON SCROLL ---------------- */
  const revealTargets = Array.from(doc.querySelectorAll(".reveal-on-scroll"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealTargets.forEach((el) => io.observe(el));
  }

  /* ---------------- FOOTER YEAR ---------------- */
  const yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- INSTAGRAM EMBED REFRESH ---------------- */
  function refreshInstagramEmbeds() {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  }
  setTimeout(refreshInstagramEmbeds, 800);

  /* ---------------- COPY BUTTONS ---------------- */
  doc.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btn-copy")) {
      const selector = target.getAttribute("data-copy-target");
      const textEl = doc.querySelector(selector);
      const text = textEl?.textContent || "";

      try {
        await navigator.clipboard.writeText(text);
        target.textContent = "Copied!";
        setTimeout(() => (target.textContent = "Copy"), 1200);
      } catch {
        alert("Press Ctrl+C to copy");
      }
    }
  });
})();
