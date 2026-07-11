/* ==========================================================
   RoomSync · Dashboard interactions
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initBarChartEntrance();
  initSyncRing(82); // avg. compatibility score %
  initSearch();
  initNotifDropdownStub();
});

/* ---------------- Sidebar toggle (mobile) ---------------- */
function initSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  if (!sidebar || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    const isInside = sidebar.contains(e.target) || toggleBtn.contains(e.target);
    if (!isInside && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  });
}

/* ---------------- Weekly activity bar chart ---------------- */
function initBarChartEntrance() {
  const bars = document.querySelectorAll('.bar-chart .bar');
  if (!bars.length) return;

  // Trigger CSS transform transition after paint
  requestAnimationFrame(() => {
    setTimeout(() => {
      bars.forEach((bar, i) => {
        setTimeout(() => {
          bar.style.transform = 'scaleY(1)';
        }, i * 70);
      });
    }, 150);
  });
}

/* ---------------- Compatibility sync ring (canvas) ---------------- */
function initSyncRing(targetPercent) {
  const canvas = document.getElementById('syncRing');
  const valueEl = document.getElementById('syncValue');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.width; // 220
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const center = size / 2;
  const radius = size / 2 - 16;
  const startAngle = -Math.PI / 2;

  const cyan = '#00F5FF';
  const purple = '#7C3AED';

  let current = 0;
  const duration = 1400;
  const startTime = performance.now();

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function draw(percent) {
    ctx.clearRect(0, 0, size, size);

    // track
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 12;
    ctx.stroke();

    // gradient progress arc
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, cyan);
    grad.addColorStop(1, purple);

    const endAngle = startAngle + (Math.PI * 2 * (percent / 100));

    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // scan dot at end of arc
    const dotX = center + radius * Math.cos(endAngle);
    const dotY = center + radius * Math.sin(endAngle);
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = cyan;
    ctx.shadowColor = cyan;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    current = easeOutCubic(t) * targetPercent;

    draw(current);
    if (valueEl) valueEl.textContent = Math.round(current) + '%';

    if (t < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

/* ---------------- Search bar (front-end filter stub) ---------------- */
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      // Front-end only: no backend wired up yet.
      console.log('Search submitted:', input.value.trim());
    }
  });

  // Cmd/Ctrl+K focuses the search bar
  document.addEventListener('keydown', (e) => {
    const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
    if (isCmdK) {
      e.preventDefault();
      input.focus();
    }
  });
}

/* ---------------- Notification bell (placeholder toggle) ---------------- */
function initNotifDropdownStub() {
  const btn = document.getElementById('notifBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Placeholder: wire this up to a real notifications panel later.
    btn.classList.toggle('active');
  });
}