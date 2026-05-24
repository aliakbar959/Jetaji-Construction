const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  revealObserver.observe(element);
});


const contactForm = document.getElementById("projectContactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const message = [
      "New Jetaji Construction enquiry",
      `Name: ${formData.get("name")}`,
      `Mobile: ${formData.get("phone")}`,
      `Project: ${formData.get("project")}`,
      `Location: ${formData.get("location")}`,
      `Details: ${formData.get("message")}`
    ].join("\n");
    const whatsappUrl = `https://wa.me/918306455053?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}
const canvas = document.getElementById("constructionScene");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let deviceScale = 1;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  deviceScale = Math.min(window.devicePixelRatio || 1, 2);
  width = rect.width;
  height = rect.height;
  canvas.width = Math.floor(width * deviceScale);
  canvas.height = Math.floor(height * deviceScale);
  ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
}

function project(point, time) {
  const rotation = Math.sin(time * 0.00035) * 0.22 + 0.42;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const x = point.x * cos - point.z * sin;
  const z = point.x * sin + point.z * cos;
  const y = point.y;
  const scale = 520 / (520 + z);
  return {
    x: width / 2 + x * scale,
    y: height * 0.58 + y * scale,
    scale
  };
}

function drawPolygon(points, fill, stroke) {
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function box(x, y, z, w, h, d, colors, time) {
  const vertices = {
    ftl: project({ x: x - w / 2, y: y - h, z: z - d / 2 }, time),
    ftr: project({ x: x + w / 2, y: y - h, z: z - d / 2 }, time),
    fbr: project({ x: x + w / 2, y, z: z - d / 2 }, time),
    fbl: project({ x: x - w / 2, y, z: z - d / 2 }, time),
    btl: project({ x: x - w / 2, y: y - h, z: z + d / 2 }, time),
    btr: project({ x: x + w / 2, y: y - h, z: z + d / 2 }, time),
    bbr: project({ x: x + w / 2, y, z: z + d / 2 }, time),
    bbl: project({ x: x - w / 2, y, z: z + d / 2 }, time)
  };

  drawPolygon([vertices.ftl, vertices.ftr, vertices.fbr, vertices.fbl], colors.front, "rgba(243,212,134,.46)");
  drawPolygon([vertices.ftr, vertices.btr, vertices.bbr, vertices.fbr], colors.side, "rgba(243,212,134,.32)");
  drawPolygon([vertices.btl, vertices.btr, vertices.ftr, vertices.ftl], colors.top, "rgba(255,255,255,.28)");

  const rows = Math.max(3, Math.floor(h / 34));
  for (let i = 1; i < rows; i += 1) {
    const yy = y - (h / rows) * i;
    const a = project({ x: x - w / 2 + 10, y: yy, z: z - d / 2 - 1 }, time);
    const b = project({ x: x + w / 2 - 10, y: yy, z: z - d / 2 - 1 }, time);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = "rgba(255,255,255,.22)";
    ctx.stroke();
  }
}

function drawCrane(time) {
  const sway = Math.sin(time * 0.001) * 18;
  const mastBottom = project({ x: -210, y: -20, z: 20 }, time);
  const mastTop = project({ x: -210, y: -255, z: 20 }, time);
  const armEnd = project({ x: 142 + sway, y: -250, z: 20 }, time);
  const hookTop = project({ x: 96 + sway, y: -250, z: 20 }, time);
  const hookBottom = project({ x: 96 + sway, y: -146 + Math.sin(time * 0.002) * 12, z: 20 }, time);

  ctx.lineCap = "round";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#d6aa4b";
  ctx.beginPath();
  ctx.moveTo(mastBottom.x, mastBottom.y);
  ctx.lineTo(mastTop.x, mastTop.y);
  ctx.lineTo(armEnd.x, armEnd.y);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(247,237,209,.7)";
  ctx.beginPath();
  ctx.moveTo(hookTop.x, hookTop.y);
  ctx.lineTo(hookBottom.x, hookBottom.y);
  ctx.stroke();

  ctx.fillStyle = "#f3d486";
  ctx.fillRect(hookBottom.x - 13, hookBottom.y, 26, 18);
}

function drawScene(time) {
  ctx.clearRect(0, 0, width, height);

  const sky = ctx.createRadialGradient(width * 0.54, height * 0.34, 20, width * 0.5, height * 0.5, width * 0.82);
  sky.addColorStop(0, "rgba(214,170,75,.28)");
  sky.addColorStop(0.45, "rgba(32,27,17,.72)");
  sky.addColorStop(1, "rgba(0,0,0,.95)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(0, Math.sin(time * 0.001) * 4);
  box(-92, 28, 0, 118, 290, 82, {
    front: "rgba(214,170,75,.86)",
    side: "rgba(99,73,25,.95)",
    top: "rgba(243,212,134,.9)"
  }, time);
  box(70, 28, -18, 132, 210, 96, {
    front: "rgba(42,38,29,.96)",
    side: "rgba(20,18,13,.95)",
    top: "rgba(214,170,75,.82)"
  }, time);
  box(12, 28, 95, 230, 72, 132, {
    front: "rgba(247,237,209,.9)",
    side: "rgba(126,91,33,.92)",
    top: "rgba(243,212,134,.86)"
  }, time);
  drawCrane(time);
  ctx.restore();

  const ground = ctx.createRadialGradient(width / 2, height * 0.78, 30, width / 2, height * 0.8, width * 0.56);
  ground.addColorStop(0, "rgba(243,212,134,.34)");
  ground.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.ellipse(width / 2, height * 0.78, width * 0.38, 54, 0, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 42; i += 1) {
    const x = (i * 97 + time * 0.012) % width;
    const y = (i * 53) % height;
    ctx.fillStyle = i % 3 === 0 ? "rgba(243,212,134,.38)" : "rgba(255,255,255,.18)";
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  requestAnimationFrame(drawScene);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawScene);

