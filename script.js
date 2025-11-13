/* Losers Content — interactions: nav toggle, smooth anchors, reveal-on-scroll, captcha, copy */

(function initLosersContentSite() {
  const doc = document;

  // Mobile nav toggle
  const navToggle = doc.querySelector('.nav-toggle');
  const navLinks = doc.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('show');
      document.body.classList.toggle('no-scroll', !expanded);
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'A') {
        navLinks.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  // IntersectionObserver for reveal-on-scroll
  const revealTargets = Array.from(doc.querySelectorAll('.reveal-on-scroll'));
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    // Fallback: show immediately
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // Footer year
  const yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Instagram embed refresh in case of dynamic content
  function refreshInstagramEmbeds() {
    // @ts-ignore
    if (window.instgrm && window.instgrm.Embeds) {
      // @ts-ignore
      window.instgrm.Embeds.process();
    }
  }
  // Give the script time to load, then process once
  setTimeout(refreshInstagramEmbeds, 800);

  // Contact form + CAPTCHA
  const form = doc.getElementById('contactform');
  const captchaLabel = doc.getElementById('captcha-label');
  const captchaAnswer = doc.getElementById('captcha-answer');
  const captchaRefresh = doc.getElementById('captcha-refresh');
  const contactDetails = doc.getElementById('contact-details');

  let a = 0, b = 0, sum = 0;
  function generateCaptcha() {
    a = Math.floor(Math.random() * 9) + 1; // 1..9
    b = Math.floor(Math.random() * 9) + 1; // 1..9
    sum = a + b;
    if (captchaLabel) captchaLabel.textContent = `Prove you are human: ${a} + ${b} = ?`;
    if (captchaAnswer) captchaAnswer.value = '';
  }
  generateCaptcha();
  if (captchaRefresh) captchaRefresh.addEventListener('click', generateCaptcha);

  function revealContacts() {
    if (!contactDetails) return;
    contactDetails.classList.remove('hidden');
    contactDetails.setAttribute('aria-hidden', 'false');
  }
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captcha check
    const answerVal = Number(captchaAnswer.value);
    if (answerVal !== sum) {
      alert("Incorrect answer.");
      generateCaptcha();
      return;
    }

    // Values
    const name = encodeURIComponent(document.getElementById("name").value);
    const email = encodeURIComponent(document.getElementById("email").value);
    const phone = encodeURIComponent(document.getElementById("phone").value);

    // GOOGLE SCRIPT URL (GET)
    const script = "https://script.google.com/macros/s/AKfycbwMIkx87gTMWSu8Ahsr3lePvVf634l_oDt2yuR3uTRJfGNL9NQhbbgcbBcqhYlMfRuN/exec";

    const url = `${script}?name=${name}&email=${email}&phone=${phone}`;

    try {
      const res = await fetch(url, { method: "GET" });
      const data = await res.json();

      if (data.result === "success") {
        revealContacts();
        contactDetails.classList.add("is-visible");
        form.reset();
      } else {
        alert("Failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  });
}


  // Copy buttons
  doc.addEventListener('click', async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches('.btn-copy')) {
      const selector = target.getAttribute('data-copy-target');
      if (!selector) return;
      const textEl = doc.querySelector(selector);
      if (!textEl) return;
      const text = textEl.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        target.textContent = 'Copied!';
        setTimeout(() => { target.textContent = 'Copy'; }, 1200);
      } catch {
        // Fallback: select text
        const range = doc.createRange();
        range.selectNodeContents(textEl);
        const sel = window.getSelection();
        sel && (sel.removeAllRanges(), sel.addRange(range));
        alert('Press Ctrl+C to copy');
        document.addEventListener("DOMContentLoaded", async () => {
          // Your social handles
          const INSTAGRAM_USERNAME = "losers_content";
          const YOUTUBE_CHANNEL_ID = "UCQzAAFSyHPPqHu7bZmPmgYQ";
          const FACEBOOK_PAGE_ID = "61574809151807";
        
          // Helper to format numbers (like 12.3K)
          function formatNumber(num) {
            if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
            if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
            return num;
          }
        
          // Instagram Follower Count (via third-party API)
          try {
            const res = await fetch(`https://api.loserscontent.vercel.app/insta?user=${INSTAGRAM_USERNAME}`);
            const data = await res.json();
            if (data.followers) {
              document.getElementById("insta-count").textContent = formatNumber(data.followers);
            }
          } catch (err) {
            console.warn("Instagram fetch failed:", err);
          }
        
          // YouTube Subscribers (using official API)
          try {
            const YT_KEY = "YOUR_YOUTUBE_API_KEY"; // replace with your key
            const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YT_KEY}`);
            const data = await res.json();
            const subs = data.items?.[0]?.statistics?.subscriberCount;
            if (subs) {
              document.getElementById("yt-count").textContent = formatNumber(subs);
            }
          } catch (err) {
            console.warn("YouTube fetch failed:", err);
          }
        
          // Facebook Follower Count (Graph API)
          try {
            const FB_TOKEN = "YOUR_FACEBOOK_ACCESS_TOKEN"; // optional short-lived token
            const res = await fetch(`https://graph.facebook.com/${FACEBOOK_PAGE_ID}?fields=followers_count&access_token=${FB_TOKEN}`);
            const data = await res.json();
            if (data.followers_count) {
              document.getElementById("fb-count").textContent = formatNumber(data.followers_count);
            }
          } catch (err) {
            console.warn("Facebook fetch failed:", err);
          }
        });
        
      }
    }
    
  });
})();


