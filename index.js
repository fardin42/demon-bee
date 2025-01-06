// Import necessary modules
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';


// Global variables
let mixer;
let bee;


// Set up Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#draw'), alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// Set initial camera position
camera.position.set(0, 0, 8);

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Load the 3D model
const loader = new GLTFLoader();
loader.load('./media/demon_bee_full_texture.glb', (gltf) => {
  bee = gltf.scene;
  scene.add(bee);
  modelMove();
  mixer = new THREE.AnimationMixer(bee);
  if (gltf.animations.length > 0) {
    mixer.clipAction(gltf.animations[0]).play();
  }
});

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(0.01);
  }
}
animate();

// Define positions and rotations for different sections
const arrPositionModel = [
  {
    id: 'header',
    position: { x: 0, y: 0, z: 4 },
    rotation: { x: 0, y: 0, z: 0 },
    mobile: {
      position: { x: 0, y: 0, z: 5 },
      rotation: { x: 0, y: 0, z: 0 },
    }
  },
  {
    id: 'introduction',
    position: { x: -3, y: -0.5, z: 4 },
    rotation: { x: 0, y: 2, z: 0 },
    mobile: {
      position: { x: 0, y: 0, z: 3 },
      rotation: { x: 0, y: 3.14, z: 0 },
    }
  },
  {
    id: 'habitat',
    position: { x: 2, y: -0.5, z: 5 },
    rotation: { x: 0, y: -1, z: 0 },
    mobile: {
      position: { x: 0, y: 0, z: 6 },
      rotation: { x: 0, y: -3.14/2, z: 0 },
    }
  },
  {
    id: 'biology',
    position: { x: 0, y: .5, z: 4 },
    rotation: { x: 4, y: 0, z: 3.14 },
    mobile: {
      position: { x: 0, y: 0, z: 3.5 },
      rotation: { x: 0, y: 3.14/2, z: 0 },
    }
  },
];

// Function to move the model based on scroll position
const modelMove = () => {
  const isMobile = window.innerWidth <= 768;
  const sections = document.querySelectorAll('.beeSec');
  let currentSection = '';

  // Determine which section is currently in view
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight / 3) {
      currentSection = section.id;
    }
  });

  // Find the corresponding position and rotation for the current section
  const position_active = arrPositionModel.findIndex((vol) => vol.id === currentSection);
  if (position_active > -1) {
    const new_coordinates = arrPositionModel[position_active];
    const coords = isMobile ? new_coordinates.mobile : new_coordinates;

    // Animate the bee's position and rotation
    gsap.to(bee.position, {
      duration: 1.5,
      x: coords.position.x,
      y: coords.position.y,
      z: coords.position.z,
      ease: "power1.out"
    });
    gsap.to(bee.rotation, {
      duration: 1.5,
      x: coords.rotation.x,
      y: coords.rotation.y,
      z: coords.rotation.z,
      ease: "power1.out"
    });
  }
};

// Add scroll event listener to trigger model movement
window.addEventListener('scroll', () => {
  if (bee) {
    modelMove();
  }
});
