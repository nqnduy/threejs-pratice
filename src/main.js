import * as THREE from "three";
import { useThreeAttrChange } from "../utils";

const renderer = new THREE.WebGL1Renderer();
const setRotation = useThreeAttrChange("rotation");
const setPosition = useThreeAttrChange("position");

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(2, 2, 5);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, flatShading: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate(time) {
    setRotation(cube, { x: time / 1000, y: time / 1000 })
    setPosition(cube, { y: Math.cos(time / 1000) })
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
