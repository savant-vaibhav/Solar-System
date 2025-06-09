const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 10, 40); // Lower the camera for better framing
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

// Planets
const planets = [];
const orbitRadii = [6, 8, 10, 12, 14, 16, 18, 20];
const sizes = [0.4, 0.7, 0.75, 0.6, 1.2, 1.0, 0.9, 0.85];
const colors = [
  0x999999, 0xffcc99, 0x3399ff, 0xff6600,
  0xffcc00, 0xcc9966, 0x66ccff, 0x6666cc
];

orbitRadii.forEach((radius, i) => {
  const geo = new THREE.SphereGeometry(sizes[i], 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: colors[i] });
  const planet = new THREE.Mesh(geo, mat);
  scene.add(planet);
  planets.push({ mesh: planet, radius, angle: Math.random() * Math.PI * 2, speed: 0.01 + i * 0.002 });
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  planets.forEach(p => {
    p.angle += p.speed;
    p.mesh.position.x = p.radius * Math.cos(p.angle);
    p.mesh.position.z = p.radius * Math.sin(p.angle);
    p.mesh.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
