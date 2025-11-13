/* Losers Content — Clean Optimized Script */

(function initLosersContentSite() {
  const doc = document;

  /* ------------------------------
      MOBILE NAV TOGGLE
  ------------------------------ */
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

  /* ------------------------------
      SCROLL REVEAL ANIMATIONS
  ------------------------------ */
  const revealTargets = [...doc.querySelectorAll(".reveal-on-scroll")];

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
