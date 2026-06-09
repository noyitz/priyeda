const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

const canvas = document.querySelector("#neural-field");
const ctx = canvas.getContext("2d");
const pointer = { x: 0, y: 0, active: false };
let points = [];

function resize() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(92, Math.max(44, Math.floor(window.innerWidth / 18)));
  points = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    r: Math.random() * 1.6 + 0.8
  }));
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const p of points) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -20) p.x = window.innerWidth + 20;
    if (p.x > window.innerWidth + 20) p.x = -20;
    if (p.y < -20) p.y = window.innerHeight + 20;
    if (p.y > window.innerHeight + 20) p.y = -20;

    if (pointer.active) {
      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 170) {
        p.x -= dx * 0.0025;
        p.y -= dy * 0.0025;
      }
    }
  }

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 118) {
        const alpha = 1 - distance / 118;
        ctx.strokeStyle = `rgba(102, 240, 255, ${alpha * 0.18})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (const p of points) {
    ctx.fillStyle = "rgba(120, 242, 181, 0.55)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resize();
draw();
