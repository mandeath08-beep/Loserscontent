/* script.js — Cleaned and combined for Losers Content
   Features:
   - nav toggle
   - loader hide
   - smooth anchors
   - reveal-on-scroll
   - contact form (GET to Apps Script)
   - counters animation
   - instagram embed refresh
   - copy button
*/

(function () {
  "use strict";
  const doc = document;

  /* ----------------- NAV TOGGLE ----------------- */
  const navToggle = doc.querySelector(".nav-toggle");
  const navLinks = doc.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("show");
      doc.body.classList.toggle("no-scroll", !expanded);
    });

    navLinks.addEventListener("click", (e) => {
      if (e.target && e.target.tagName === "A") {
        navLinks.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
        doc.body.classList.remove("no-scroll");
      }
    });
  }

  /* ----------------- LOADER ----------------- */
  window.addEventListener("load", () => {
    const loader = doc.getElementById("loader");
    if (!loader) return;
    // fade & remove loader
    loader.classList.add("is-hidden");
    setTimeout(() => {
      loader.style.display = "none";
    }, 700);
  });

  /* ----------------- SMOOTH SCROLL (anchor links) ----------------- */
  // CSS fallback: html { scroll-behavior: smooth; } recommended in styles.css
  doc.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = doc.querySelector(href);
      if (target) {
        e.preventDefault();
        // Slight offset for sticky header (80px) — animate by window.scrollTo for offset
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  /* ----------------- REVEAL ON SCROLL ----------------- */
  const revealTargets = Array.from(doc.querySelectorAll(".reveal-on-scroll"));
  if ("IntersectionObserver" in window && revealTargets.length) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ----------------- FOOTER YEAR ----------------- */
  const yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------- INSTAGRAM EMBED REFRESH ----------------- */
  function refreshInstagram() {
    if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === "function") {
      try { window.instgrm.Embeds.process(); } catch (e) { /* ignore */ }
    }
  }
  setTimeout(refreshInstagram, 800);

  /* ----------------- COUNTERS (animate numbers) ----------------- */
  function formatNumber(num) {
    if (num >= 1000000) return Math.floor(num / 1000000) + "M";
    if (num >= 1000) return Math.floor(num / 1000) + "K";
    return num.toString();
  }

  function animateCount(el, endValue) {
    let start = 0;
    const duration = 1400;
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const val = Math.floor(progress * endValue);
      el.textContent = formatNumber(val);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(endValue);
    }
    requestAnimationFrame(step);
  }

  const countEls = Array.from(doc.querySelectorAll(".social-count, .stat-number"));
  const countObserver = ("IntersectionObserver" in window)
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = "true";
            const raw = entry.target.textContent.replace(/[^\d]/g, "");
            const end = parseInt(raw || "0", 10);
            animateCount(entry.target, end);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 })
    : null;
  countEls.forEach((el) => {
    const raw = el.textContent.replace(/[^\d]/g, "");
    el.textContent = "0";
    if (countObserver) countObserver.observe(el);
    else animateCount(el, parseInt(raw || "0", 10));
  });

  /* ----------------- COPY BUTTON ----------------- */
  doc.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.matches(".btn-copy")) {
      const sel = target.getAttribute("data-copy-target");
      if (!sel) return;
      const el = doc.querySelector(sel);
      const text = el ? el.textContent : "";
      try {
        await navigator.clipboard.writeText(text || "");
        const old = target.textContent;
        target.textContent = "Copied!";
        setTimeout(() => (target.textContent = old), 1200);
      } catch {
        alert("Copy failed — press Ctrl+C");
      }
    }
  });

  /* ----------------- CONTACT FORM (Captcha + Apps Script GET) ----------------- */
  (function contactModule() {
    const form = doc.getElementById("contactForm");
    const captchaLabel = doc.getElementById("captcha-label");
    const captchaInput = doc.getElementById("captcha");
    const captchaRefresh = doc.getElementById("captcha-refresh");
    const contactDetails = doc.getElementById("contactDetails");

    if (!form || !captchaLabel || !captchaInput) return;

    let a = 0,
      b = 0,
      sum = 0;
    function makeCaptcha() {
      a = Math.floor(Math.random() * 8) + 1;
      b = Math.floor(Math.random() * 8) + 1;
      sum = a + b;
      captchaLabel.textContent = `Prove you are human: ${a} + ${b} = ?`;
      captchaInput.value = "";
    }
    makeCaptcha();
    if (captchaRefresh) captchaRefresh.addEventListener("click", makeCaptcha);

    // Apps Script URL (GET-based)
    const scriptURL = "https://script.google.com/macros/s/AKfycbwMIkx87gTMWSu8Ahsr3lePvVf634l_oDt2yuR3uTRJfGNL9NQhbbgcbBcqhYlMfRuN/exec";

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();

      const answer = Number(captchaInput.value);
      if (Number.isNaN(answer) || answer !== sum) {
        alert("Incorrect captcha — try again.");
        makeCaptcha();
        return;
      }

      const name = encodeURIComponent((doc.getElementById("name") || {}).value || "");
      const email = encodeURIComponent((doc.getElementById("email") || {}).value || "");
      const phone = encodeURIComponent((doc.getElementById("phone") || {}).value || "");

      // Build GET URL
      const url = `${scriptURL}?name=${name}&email=${email}&phone=${phone}`;

      try {
        const res = await fetch(url, { method: "GET", mode: "cors" });
        // many Apps Script endpoints return text — try parse safely
        const txt = await res.text();
        let json = null;
        try { json = JSON.parse(txt); } catch { /* maybe plain text */ }

        if (json && json.result === "success") {
          contactDetails && (contactDetails.style.display = "block", contactDetails.classList.remove("hidden"), contactDetails.setAttribute("aria-hidden", "false"));
          form.reset();
          makeCaptcha();
        } else {
          // if parse failed, assume success if status 200
          if (res.ok) {
            contactDetails && (contactDetails.style.display = "block", contactDetails.classList.remove("hidden"), contactDetails.setAttribute("aria-hidden", "false"));
            form.reset();
            makeCaptcha();
          } else {
            alert("Server error saving data. Try again later.");
          }
        }
      } catch (err) {
        console.error("Contact submit error:", err);
        alert("Network error while saving — try again.");
      }
    });
  })();

})();
