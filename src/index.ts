// add styles
import './style.css';
// three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// create the scene
const scene = new THREE.Scene();

// create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//camera.position.setZ(30);
//camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers
/*
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)
*/
const controls = new OrbitControls(camera, renderer.domElement);

//Add Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill(100,0,100).map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill(200,0,200).forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('./src/assets/space.jpg');
scene.background = spaceTexture;

// Avatar

const cubeTexture = new THREE.TextureLoader().load('./src/assets/cube.jpg');

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ map: cubeTexture }));

scene.add(cube);

// Moon

const moonTexture = new THREE.TextureLoader().load('./src/assets/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('./src/assets/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-6);

cube.position.z = -4;
cube.position.x = 1;
cube.position.y = 1;
cube.quaternion.y = -0.05;
cube.quaternion.x = 0.1;
// Scroll Animation

function moveCamera() {
  var t = document.body.getBoundingClientRect().top;
  if(t < 0){
    
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
  }
}


document.body.onscroll = moveCamera;
moveCamera();

//onWindowResize

window.addEventListener('resize', onWindowResize.bind(this), false);

function onWindowResize(): void {
  const width: number = window.innerWidth;
  const height: number = window.innerHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  (camera as THREE.PerspectiveCamera).aspect = width / height;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
}

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  controls.update();
  
  renderer.render(scene, camera);
}

animate();