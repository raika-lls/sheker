import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const viewer = document.getElementById("viewer3d");
const loadingText = document.getElementById("loadingText");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  viewer.clientWidth / viewer.clientHeight,
  0.1,
  100
);

camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 10;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambientLight);

const light2 = new THREE.DirectionalLight(0xffffff, 1.2);
light2.position.set(5, 8, 5);
scene.add(light2);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(-4, 4, -3);
scene.add(fillLight);

const cakeGroup = new THREE.Group();
scene.add(cakeGroup);

let cakeModel = null;
let baseScale = 1;

const loader = new GLTFLoader();

loader.load(
  "./cake.glb",
  function (gltf) {
    cakeModel = gltf.scene;
    cakeGroup.add(cakeModel);

    const box = new THREE.Box3().setFromObject(cakeModel);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const maxAxis = Math.max(size.x, size.y, size.z);

    if (!maxAxis || !isFinite(maxAxis)) {
      loadingText.innerText = "Модель загрузилась, но размер определить не удалось";
      return;
    }

    baseScale = 2.4 / maxAxis;

    cakeModel.scale.setScalar(baseScale);
    cakeModel.position.set(-center.x, -center.y + 0.1, -center.z);

    controls.target.set(0, 0.3, 0);
    controls.update();

    updateCakeSize("10");
    loadingText.style.display = "none";
  },
  undefined,
  function (error) {
    console.error(error);
    loadingText.innerText = "Ошибка загрузки модели cake.glb";
  }
);

const sizeButtons = document.querySelectorAll(".size-btn");
const diameterValue = document.getElementById("diameterValue");
const weightValue = document.getElementById("weightValue");
const servingsValue = document.getElementById("servingsValue");
const descriptionValue = document.getElementById("descriptionValue");

const sizeData = {
  "10": {
    scale: 1,
    diameter: "10 см",
    weight: "300–400 г",
    servings: "1–2 человека",
    description: "Компактный бенто-торт для небольшого праздника, сюрприза или подарка."
  },
  "15": {
    scale: 1.35,
    diameter: "15 см",
    weight: "600–700 г",
    servings: "3–4 человека",
    description: "Более заметный размер бенто-торта для компании побольше."
  }
};

function updateCakeSize(size) {
  const data = sizeData[String(size)];
  if (!data) return;

  if (cakeModel) {
    cakeModel.scale.setScalar(baseScale * data.scale);
  }

  diameterValue.textContent = data.diameter;
  weightValue.textContent = data.weight;
  servingsValue.textContent = data.servings;
  descriptionValue.textContent = data.description;

  sizeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.size === String(size));
  });
}

sizeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    updateCakeSize(this.dataset.size);
  });
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
  const width = viewer.clientWidth;
  const height = viewer.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});