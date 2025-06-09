let isPaused = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 40);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet config
const planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
const orbitRadii = [6, 8, 10, 12, 14, 16, 18, 20];
const sizes = [0.4, 0.7, 0.75, 0.6, 1.2, 1.0, 0.9, 0.85];
const colors = [
  0x999999, 0xffcc99, 0x3399ff, 0xff6600,
  0xffcc00, 0xcc9966, 0x66ccff, 0x6666cc
];

const planets = [];
const planetSpeeds = {}; // Dynamic speed map

planetNames.forEach((name, i) => {
  const geo = new THREE.SphereGeometry(sizes[i], 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: colors[i] });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  planets.push({ name, mesh, radius: orbitRadii[i], angle: Math.random() * Math.PI * 2, speed: 0.01 + i * 0.002 });
  planetSpeeds[name] = 1; // default speed multiplier
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  if (isPaused) return;

  planets.forEach(p => {
    p.angle += p.speed * planetSpeeds[p.name];
    p.mesh.position.x = p.radius * Math.cos(p.angle);
    p.mesh.position.z = p.radius * Math.sin(p.angle);
    p.mesh.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}
document.getElementById("toggleBtn").addEventListener("click", function () {
  isPaused = !isPaused;
  this.textContent = isPaused ? "Resume" : "Pause";
});


animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Event listeners for sliders (you must match IDs in HTML)
planetNames.forEach(name => {
  const slider = document.getElementById(`${name}Speed`);
  if (slider) {
    slider.addEventListener("input", (e) => {
      planetSpeeds[name] = parseFloat(e.target.value);
    });
  }
});



//background
function addStars(count = 1000) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < count; i++) {
    vertices.push(
      THREE.MathUtils.randFloatSpread(2000),
      THREE.MathUtils.randFloatSpread(2000),
      THREE.MathUtils.randFloatSpread(2000)
    );
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}

addStars();



// Raycaster for hover tooltips
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.color = 'white';
tooltip.style.background = 'rgba(0,0,0,0.7)';
tooltip.style.padding = '2px 5px';
tooltip.style.borderRadius = '4px';
tooltip.style.fontSize = '12px';
tooltip.style.display = 'none';
document.body.appendChild(tooltip);

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

  if (intersects.length > 0) {
    const planet = planets.find(p => p.mesh === intersects[0].object);
    tooltip.textContent = planet.name.toUpperCase();
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.style.top = event.clientY + 10 + 'px';
    tooltip.style.display = 'block';
  } else {
    tooltip.style.display = 'none';
  }
});

