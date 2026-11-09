const sparks = document.getElementById("header-sparks");
if (sparks && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const context = sparks.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  const resize = () => {
    width = sparks.width = sparks.offsetWidth;
    height = sparks.height = sparks.offsetHeight;
  };
  const make = () => ({
    x: Math.random() * width,
    y: height + Math.random() * 16,
    r: Math.random() * 2.4 + 1.1,
    v: Math.random() * 0.45 + 0.16,
    a: Math.random() * 0.35 + 0.65,
    p: Math.random() * 6,
  });
  resize();
  window.addEventListener("resize", () => {
    resize();
    particles = Array.from({ length: 54 }, make);
  });
  particles = Array.from({ length: 54 }, () => {
    const particle = make();
    particle.y = Math.random() * height;
    return particle;
  });
  const tick = (time) => {
    context.clearRect(0, 0, width, height);
    for (const particle of particles) {
      particle.y -= particle.v;
      particle.x += Math.sin(time / 2000 + particle.p) * 0.2;
      if (particle.y < -8) Object.assign(particle, make());
      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      const twinkle = 0.45 + 0.55 * Math.sin(time / 420 + particle.p);
      context.fillStyle = `rgba(210, 245, 255, ${particle.a * twinkle})`;
      context.shadowColor = "#9ae6ff";
      context.shadowBlur = 18;
      context.fill();
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const header = document.getElementById("header");
let lastScrollY = window.scrollY;
let scrollUpFrom = window.scrollY;
let showHeaderTimer = 0;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (y < 24) {
      clearTimeout(showHeaderTimer);
      showHeaderTimer = 0;
      header.classList.remove("is-hidden");
    } else if (y > lastScrollY) {
      clearTimeout(showHeaderTimer);
      showHeaderTimer = 0;
      scrollUpFrom = y;
      header.classList.add("is-hidden");
    } else if (header.classList.contains("is-hidden") && scrollUpFrom - y > 140 && !showHeaderTimer) {
      showHeaderTimer = window.setTimeout(() => {
        showHeaderTimer = 0;
        header.classList.remove("is-hidden");
      }, 700);
    }
    lastScrollY = y;
  },
  { passive: true }
);

const nav = document.getElementById("nav");
const toggle = document.getElementById("nav-toggle");
const form = document.getElementById("lead-form");
const note = document.getElementById("form-note");

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("is-open"));
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nombre = String(data.get("nombre") || "").trim();
  const telefono = String(data.get("telefono") || "").trim();
  const mensaje = String(data.get("mensaje") || "Quiero un terreno de 500 m² desde $12.000.000, en cuotas de $500.000.").trim();
  const text = `Hola, soy ${nombre}. Mi teléfono es ${telefono}. ${mensaje}`;
  window.open(`https://wa.me/56953887975?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  note.hidden = false;
  note.textContent = "Te estamos abriendo WhatsApp para continuar la conversación.";
});
