import {
    WebGL1Renderer,
    PerspectiveCamera,
    Scene,
    Mesh,
    BoxGeometry,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Color,
    PlaneGeometry,
    GridHelper,
    DoubleSide,
    AxesHelper,
    SphereGeometry,
    AmbientLight,
    DirectionalLight,
    DirectionalLightHelper,
} from "three";
import * as dat from 'dat.gui';
import useSetThreeAttr from "@/hooks/useSetThreeAttr";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import assetLoader from "@/assetLoader";

const renderer = new WebGL1Renderer();
const setRotation = useSetThreeAttr("rotation");
const setPosition = useSetThreeAttr("position");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();

const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 15, 20);
orbit.update();
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshBasicMaterial({ color: 0x556fff, flatShading: true });
const cube = new Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

const planGeometry = new PlaneGeometry(30, 30);
const planMaterial = new MeshStandardMaterial({
    color: 0xe0d4d7,
    side: DoubleSide,
    flatShading: true
});
const plan = new Mesh(planGeometry, planMaterial);
setRotation(plan, { x: - Math.PI * 0.5 });
scene.add(plan);

const gridHelper = new GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new SphereGeometry(4, 50, 50);
const sphereMaterial = new MeshStandardMaterial({ color: 0xffba02, wireframe: false });
const sphere = new Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);

const ambientLight = new AmbientLight(0x333333);
scene.add(ambientLight);

const directionLight = new DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionLight);
directionLight.position.set(-9, 50, 0);

const dLightHelper = new DirectionalLightHelper(directionLight);
scene.add(dLightHelper);

const gui = new dat.GUI();
const options = {
    sphereColor: 0xffba02,
    wireframe: false,
    speed: 0.01
}

gui.addColor(options, 'sphereColor').onChange((e) => {
    sphere.material.color.set(e);
})
gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
})
gui.add(options, 'speed', 0, 0.1);

let step = 0;

function animate(time) {
    setRotation(cube, { x: time / 1000, y: time / 1000 })
    setPosition(cube, { y: Math.sin(time / 1000) })

    step += options.speed;
    setPosition(sphere, { y: 10 * Math.abs(Math.sin(step)) });
    renderer.render(scene, camera);

}

renderer.setAnimationLoop(animate);
