"use strict";

/* ── Particles Background ── */
(function initParticles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W,
    H,
    pts = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initPts() {
    pts = Array.from({ length: 72 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      a: Math.random() * 0.4 + 0.07,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.a})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }

  resize();
  initPts();
  draw();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initPts();
    }, 200);
  });
})();

/* ── Reading Progress Bar ── */
(function initReadingBar() {
  const bar = document.getElementById("reading-bar");
  const btn = document.getElementById("top-btn");
  if (!bar) return;

  window.addEventListener(
    "scroll",
    () => {
      const scrolled = document.documentElement.scrollTop;
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      bar.style.width = (scrolled / total) * 100 + "%";

      if (btn) {
        scrolled > 400
          ? btn.classList.add("show")
          : btn.classList.remove("show");
      }
    },
    { passive: true },
  );
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

/* ── Timeline Steps Animation ── */
(function initSteps() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.d || 0, 10);
          setTimeout(() => entry.target.classList.add("in"), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".step").forEach((s) => observer.observe(s));
})();

/* ── Toggle Step Detail ── */
function toggleStep(el) {
  const isOpen = el.classList.contains("open");
  document
    .querySelectorAll(".step-card.open")
    .forEach((c) => c.classList.remove("open"));
  if (!isOpen) el.classList.add("open");
}

// Expose globally for inline onclick
window.toggleStep = toggleStep;

/* ── Progress Bars Animation ── */
(function initProgressBars() {
  const box = document.getElementById("prog-box");
  if (!box) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        document.querySelectorAll(".bar-fill").forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.w + "%";
          }, i * 90);
        });
        observer.unobserve(box);
      }
    },
    { threshold: 0.2 },
  );

  observer.observe(box);
})();

/* ── Mobile Navigation ── */
(function initMobileNav() {
  const toggle = document.getElementById("navtoggle");
  const links = document.getElementById("navlinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
    const isOpen = links.classList.contains("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close on link click
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ── Back To Top ── */
(function initBackToTop() {
  const btn = document.getElementById("top-btn");
  if (!btn) return;
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
})();

/* ── Disable Copy & Context Menu ── */
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("selectstart", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());
