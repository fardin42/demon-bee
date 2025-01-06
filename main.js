

import * as THREE from 'three';

// Import OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// Import GUI from lil-gui
import GUI from 'lil-gui';
// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('draw'),  });
renderer.setSize(window.innerWidth, window.innerHeight);

let AmbientLight = new THREE.AmbientLight(0xffffff, .5);
scene.add(AmbientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

const helper = new THREE.DirectionalLightHelper( directionalLight, 2 );
scene.add( helper );

// Create a point light
const pointLight = new THREE.PointLight(0xffffff, 1, 10,2);
pointLight.position.set(0.3, -1.3, 1);
scene.add(pointLight);

const sphereSize = .2;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );





let loader = new THREE.TextureLoader();
let color = loader.load("./media/paper/color.jpg");
let roughness = loader.load("./media/paper/roughness.jpg");
let normal = loader.load("./media/paper/normal.png");

// Create a box geometry
const geometry = new THREE.BoxGeometry(3, 1.8, 2,);
 
const material = new THREE.MeshStandardMaterial( { map: color,  roughnessMap:roughness, normalMap:normal, roughness: 0.2, metalness: 0.4 } ); 
const sphere = new THREE.Mesh( geometry, material ); scene.add( sphere );


// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping effect
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;

// Update controls in the animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Rotate the sphere
    // sphere.rotation.x += 0.01;
    // sphere.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
}
// Start the animation loop
animate();

// Add the cube to the scene
scene.add(sphere);

function onWindowResize() {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
}
// Initial call to set the correct size
onWindowResize();
// Animation loop



// Function to handle window resize


// Add event listener for window resize
window.addEventListener('resize', onWindowResize);




// Create GUI
const gui = new GUI();
// Lights folder
const lightsFolder = gui.addFolder('Lights');

// Ambient Light
const ambientLightFolder = lightsFolder.addFolder('Ambient Light');
ambientLightFolder.add(AmbientLight, 'intensity', 0, 1);
ambientLightFolder.addColor(AmbientLight, 'color');

// Directional Light
const directionalLightFolder = lightsFolder.addFolder('Directional Light');
directionalLightFolder.add(directionalLight, 'intensity', 0, 1);
directionalLightFolder.addColor(directionalLight, 'color');
directionalLightFolder.add(directionalLight.position, 'x', -5, 5);
directionalLightFolder.add(directionalLight.position, 'y', -5, 5);
directionalLightFolder.add(directionalLight.position, 'z', -5, 5);

// Point Light
const pointLightFolder = lightsFolder.addFolder('Point Light');
pointLightFolder.add(pointLight, 'intensity', 0, 1);
pointLightFolder.addColor(pointLight, 'color');
pointLightFolder.add(pointLight.position, 'x', -5, 5);
pointLightFolder.add(pointLight.position, 'y', -5, 5);
pointLightFolder.add(pointLight.position, 'z', -5, 5);
pointLightFolder.add(pointLight, 'distance', 0, 20);
pointLightFolder.add(pointLight, 'decay', 0, 2);

// Update function for lights
function updateLights() {
    helper.update();
    pointLightHelper.update();
}

// Add onChange event to each light controller
lightsFolder.controllers.forEach((controller) => {
    controller.onChange(updateLights);
});

// Material folder
const materialFolder = gui.addFolder('Material');
materialFolder.add(material, 'wireframe');
materialFolder.addColor(material, 'color');
materialFolder.add(material, 'metalness', 0, 1);
materialFolder.add(material, 'roughness', 0, 1);
materialFolder.add(material, 'emissive');
materialFolder.add(material, 'emissiveIntensity', 0, 1);


// Mesh folder
const meshFolder = gui.addFolder('Mesh');
meshFolder.add(sphere.position, 'x', -5, 5);
meshFolder.add(sphere.position, 'y', -5, 5);
meshFolder.add(sphere.position, 'z', -5, 5);
meshFolder.add(sphere.rotation, 'x', 0, Math.PI * 2);
meshFolder.add(sphere.rotation, 'y', 0, Math.PI * 2);
meshFolder.add(sphere.rotation, 'z', 0, Math.PI * 2);
meshFolder.add(sphere.scale, 'x', 0.1, 2);
meshFolder.add(sphere.scale, 'y', 0.1, 2);
meshFolder.add(sphere.scale, 'z', 0.1, 2);

// Update function to apply changes
function updateMaterial() {
    sphere.material.needsUpdate = true;
}

// Add onChange event to each controller
gui.controllers.forEach((controller) => {
    controller.onChange(updateMaterial);
});




// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
