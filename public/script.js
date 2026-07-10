/* =============================================================
   RoomSync — Login page behavior
   Frontend only. No network calls are made here — hook up
   #loginForm's submit handler to your real auth endpoint.
   ============================================================= */

(function () {
  "use strict";

  /* -----------------------------------------------------------
     Ambient particle field (signature element)
     Nodes drift slowly; when two pass close to each other, a
     thin line "syncs" them for a moment — a quiet visual echo
     of what the product actually does.
     ----------------------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    let width, height, dpr;
    let particles = [];
    const LINK_DISTANCE = 130;
    const PARTICLE_COLORS = ["rgba(0,245,255,", "rgba(124,58,237,"];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(70, Math.floor((width * height) / 18000));
      particles = Array.from({ length: count }, () => spawnParticle());
    }

    function spawnParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.6,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      };
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "0.55)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DISTANCE) {
            const opacity = (1 - dist / LINK_DISTANCE) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(0,245,255," + opacity + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(step);
  }

  /* -----------------------------------------------------------
     Password visibility toggle
     ----------------------------------------------------------- */
  function initPasswordToggle() {
    const toggle = document.getElementById("togglePassword");
    const input = document.getElementById("password");
    if (!toggle || !input) return;

    toggle.addEventListener("click", function () {
      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      toggle.setAttribute("aria-pressed", String(!isVisible));
      toggle.setAttribute(
        "aria-label",
        isVisible ? "Show password" : "Hide password"
      );
    });
  }

 

  /* -----------------------------------------------------------
     Login form submit — loading state
     Prevents default here only because there is no backend in
     this build. Replace the body of handleSubmit with a real
     fetch()/XHR call to your auth endpoint, then remove
     resetButton() once you redirect on success.
     ----------------------------------------------------------- */
  function initLoginForm() {
    const form = document.getElementById("loginForm");
    const button = document.getElementById("loginBtn");
    if (!form || !button) return;

    function setLoading(isLoading) {
      button.classList.toggle("is-loading", isLoading);
      button.disabled = isLoading;
      form
        .querySelectorAll("input")
        .forEach((el) => (el.disabled = isLoading));
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (button.classList.contains("is-loading")) return;

      setLoading(true);

      // ---- Backend integration point ----
      // Replace this timeout with the real authentication request,
      // e.g.:
      //   fetch('/auth/login', { method: 'POST', body: new FormData(form) })
      //     .then(handleResponse)
      //     .catch(handleError);
      window.setTimeout(function () {
        setLoading(false);
      }, 1600);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initParticles();
    initPasswordToggle();
    initCaptchaRefresh();
    initLoginForm();
  });
})();