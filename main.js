import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- scroll reveal ---------- */

const revealTargets = document.querySelectorAll(
  ".section-head, .about-grid, .facts, .skill-group, .job, .project, .contact-lede, .contact-grid"
);

if (!reduceMotion && "IntersectionObserver" in window) {
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -80px 0px", threshold: 0.12 }
  );
  revealTargets.forEach((el) => io.observe(el));
}

/* ---------- lanyard ---------- */

const canvas = document.querySelector("#lanyard");

if (canvas) {
  const PHOTO_URL = "assets/profile.jpg";
  const W = 640;
  const H = 880;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.1, 6.4);

  const cardGroup = new THREE.Group();
  cardGroup.position.set(0, -0.5, 0);
  scene.add(cardGroup);

  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x0a0c0d, 1.35));

  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(-3, 5, 5);
  scene.add(key);

  const rim = new THREE.PointLight(0xa3e37a, 26, 16);
  rim.position.set(4, -1, 3);
  scene.add(rim);

  /* card */

  const cardW = 1.92;
  const cardH = 2.62;
  const cardD = 0.08;

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1b1f21,
    roughness: 0.5,
    metalness: 0.2,
  });

  const cardBody = new THREE.Mesh(
    new RoundedBoxGeometry(cardW, cardH, cardD, 5, 0.11),
    bodyMat
  );
  cardGroup.add(cardBody);

  /* face texture */

  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = W;
  faceCanvas.height = H;
  const ctx = faceCanvas.getContext("2d");

  const texture = new THREE.CanvasTexture(faceCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const faceMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.62,
    metalness: 0.05,
  });

  const face = new THREE.Mesh(new THREE.PlaneGeometry(cardW - 0.14, cardH - 0.14), faceMat);
  face.position.z = cardD / 2 + 0.001;
  cardGroup.add(face);

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawFace(photo) {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#0f1214";
    ctx.fillRect(0, 0, W, H);

    const pad = 38;
    const photoH = 452;

    if (photo) {
      ctx.save();
      roundRect(pad, pad, W - pad * 2, photoH, 26);
      ctx.clip();
      const scale = Math.max((W - pad * 2) / photo.width, photoH / photo.height);
      const dw = photo.width * scale;
      const dh = photo.height * scale;
      ctx.drawImage(photo, pad + (W - pad * 2 - dw) / 2, pad + (photoH - dh) / 2, dw, dh);
      ctx.restore();
    } else {
      const grad = ctx.createLinearGradient(pad, pad, W - pad, photoH);
      grad.addColorStop(0, "#1d2420");
      grad.addColorStop(1, "#131719");
      ctx.fillStyle = grad;
      roundRect(pad, pad, W - pad * 2, photoH, 26);
      ctx.fill();

      ctx.strokeStyle = "#2b3128";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#a3e37a";
      ctx.font = "500 132px 'Roboto', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("MFU", W / 2, pad + photoH / 2 - 6);

      ctx.fillStyle = "#7d857f";
      ctx.font = "400 20px 'Roboto Mono', monospace";
      ctx.fillText("FOTO PROFIL", W / 2, pad + photoH / 2 + 96);
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#a3e37a";
    ctx.fillRect(pad, 552, 54, 4);

    ctx.fillStyle = "#f2f4f1";
    ctx.font = "500 48px 'Roboto', sans-serif";
    ctx.fillText("Muhammad", pad, 626);
    ctx.fillText("Fakhruddin Usman", pad, 682);

    ctx.fillStyle = "#a3e37a";
    ctx.font = "500 22px 'Roboto Mono', monospace";
    ctx.fillText("MOBILE DEVELOPER", pad, 742);

    ctx.fillStyle = "#8b9490";
    ctx.font = "400 20px 'Roboto Mono', monospace";
    ctx.fillText("MALANG, ID", pad, 796);
    ctx.fillText("FLUTTER / KOTLIN / SWIFT", pad, 828);

    texture.needsUpdate = true;
  }

  drawFace(null);

  const photo = new Image();
  let loadedPhoto = null;
  photo.onload = () => {
    loadedPhoto = photo;
    drawFace(photo);
  };
  photo.onerror = () => {};
  photo.src = PHOTO_URL;

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => drawFace(loadedPhoto));
  }

  /* clip + straps */

  const clip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.052, 0.052, 0.16, 20),
    new THREE.MeshStandardMaterial({ color: 0x9aa1a6, roughness: 0.35, metalness: 0.7 })
  );
  clip.rotation.z = Math.PI / 2;
  clip.position.set(0, cardH / 2 + 0.04, 0);
  cardGroup.add(clip);

  const strapMat = new THREE.MeshStandardMaterial({
    color: 0x3d4441,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  const anchor = new THREE.Vector3(0, 4.6, 0.06);
  const straps = [0, 1].map(() => {
    const geo = new THREE.PlaneGeometry(0.1, 1, 1, 1);
    geo.translate(0, -0.5, 0);
    const mesh = new THREE.Mesh(geo, strapMat);
    scene.add(mesh);
    return mesh;
  });

  const upLocal = new THREE.Vector3(0, -1, 0);
  const cornerA = new THREE.Vector3(-0.66, cardH / 2 - 0.02, 0.02);
  const cornerB = new THREE.Vector3(0.66, cardH / 2 - 0.02, 0.02);
  const tmpTarget = new THREE.Vector3();
  const tmpDir = new THREE.Vector3();

  function layoutStraps() {
    cardGroup.updateMatrixWorld(true);
    [cornerA, cornerB].forEach((corner, i) => {
      tmpTarget.copy(corner);
      cardGroup.localToWorld(tmpTarget);
      tmpDir.subVectors(tmpTarget, anchor);
      const len = tmpDir.length();
      const mesh = straps[i];
      mesh.position.copy(anchor);
      mesh.quaternion.setFromUnitVectors(upLocal, tmpDir.normalize());
      mesh.scale.y = len;
    });
  }

  /* interaction + motion */

  let targetY = 0;
  let targetX = 0;
  let currentY = 0;
  let currentX = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velocity = 0;
  let pointerX = 0;
  let pointerY = 0;

  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (dragging) {
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      targetY += dx * 0.009;
      targetX = THREE.MathUtils.clamp(targetX + dy * 0.005, -0.55, 0.55);
      velocity = dx * 0.009;
    } else {
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    }
  });

  const endDrag = () => {
    dragging = false;
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", () => {
    if (!dragging) {
      pointerX = 0;
      pointerY = 0;
    }
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    ).observe(canvas);
  }

  const clock = new THREE.Clock();

  function frame() {
    const t = clock.getElapsedTime();

    if (!reduceMotion) {
      if (!dragging) {
        targetY += velocity;
        velocity *= 0.94;
        targetY += (pointerX * 0.4 - targetY) * 0.02;
        targetX += (pointerY * 0.16 - targetX) * 0.02;
      }

      const idleZ = Math.sin(t * 0.85) * 0.045;
      const idleX = Math.sin(t * 0.62 + 1.2) * 0.028;

      currentY += (targetY - currentY) * 0.075;
      currentX += (targetX - currentX) * 0.075;

      cardGroup.rotation.y = currentY;
      cardGroup.rotation.x = currentX + idleX;
      cardGroup.rotation.z = idleZ;
      cardGroup.position.y = -0.5 + Math.sin(t * 0.7) * 0.02;

      cardGroup.updateMatrixWorld(true);
      layoutStraps();
    }

    renderer.render(scene, camera);
  }

  function loop() {
    if (!visible || document.hidden) {
      requestAnimationFrame(loop);
      return;
    }
    frame();
    requestAnimationFrame(loop);
  }

  resize();
  layoutStraps();

  if (reduceMotion) {
    renderer.render(scene, camera);
  } else {
    requestAnimationFrame(loop);
  }
}
