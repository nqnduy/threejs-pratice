import useSetThreeAttr from "@/hooks/useSetThreeAttr";
import nebula from '@/img/nebula.jpg';
import stars from '@/img/stars.jpg';
import * as dat from 'dat.gui';
import {
    AmbientLight,
    AxesHelper,
    BoxGeometry,
    CameraHelper,
    CubeTextureLoader,
    DirectionalLight,
    DirectionalLightHelper,
    DoubleSide,
    FogExp2,
    GridHelper,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Raycaster,
    Scene,
    ShaderMaterial,
    SphereGeometry,
    TextureLoader,
    Vector2,
    WebGLRenderer
} from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new WebGLRenderer();
const setRotation = useSetThreeAttr("rotation");
const setPosition = useSetThreeAttr("position");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
const scene = new Scene();

const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 10, 40);
orbit.update();
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);

const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshBasicMaterial({ color: 0x556fff, flatShading: true });
const cube = new Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

const planeGeometry = new PlaneGeometry(30, 30);
const planeMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    side: DoubleSide,
    flatShading: true
});

const plane = new Mesh(planeGeometry, planeMaterial);
setRotation(plane, { x: - Math.PI * 0.5 });
scene.add(plane);
plane.receiveShadow = true;

const gridHelper = new GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new SphereGeometry(4, 50, 50);
const sphereMaterial = new MeshStandardMaterial({ color: 0xffba02, wireframe: false });
const sphere = new Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

const ambientLight = new AmbientLight(0x333333);
scene.add(ambientLight);

const directionLight = new DirectionalLight(0xFFFFFF, 1);
scene.add(directionLight);
directionLight.position.set(-30, 50, 0);
directionLight.castShadow = true;
directionLight.shadow.camera.bottom = -12;

const dLightHelper = new DirectionalLightHelper(directionLight, 5);
scene.add(dLightHelper);

const dLightShadowHelper = new CameraHelper(directionLight.shadow.camera);
scene.add(dLightShadowHelper);

// const spotLight = new SpotLight(0xFFFFFF);
// spotLight.position.set(-100, 100, 0);
// spotLight.castShadow = true;
// spotLight.angle = 0.2;
// scene.add(spotLight);

// const sLightHelper = new SpotLightHelper(spotLight);
// scene.add(sLightHelper);

// scene.fog = new Fog(0xFFFFFF, 0, 200);
// scene.fog = new Fog(0xFFFFFF, 0.2);
scene.fog = new FogExp2(0xFFFFFF, 0.01);

// renderer.setClearColor(0xFFEA00);
const textureLoader = new TextureLoader();
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars,
])

const box2Geometry = new BoxGeometry(4, 4, 4);
const box2Material = new MeshBasicMaterial({
    // map: textureLoader.load(nebula)
});

const box2MultiMaterial = [
    new MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new MeshBasicMaterial({ map: textureLoader.load(nebula) }),
    new MeshBasicMaterial({ map: textureLoader.load(stars) }),
    new MeshBasicMaterial({ map: textureLoader.load(nebula) }),
    new MeshBasicMaterial({ map: textureLoader.load(stars) }),
]
const box2 = new Mesh(box2Geometry, box2MultiMaterial);
// box2.material.map = textureLoader.load(nebula)
box2.position.set(5, 10, -5)
scene.add(box2);

const plane2Geometry = new PlaneGeometry(10, 10, 10, 10);
const plane2Material = new MeshBasicMaterial({
    color: 0xe0d4d7,
    wireframe: true,
    flatShading: true,
});
const plane2 = new Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);


plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

const sphere2Geometry = new SphereGeometry(4);
const sphere2Material = new ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});
const sphere2 = new Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const gui = new dat.GUI();
const options = {
    sphereColor: 0xffba02,
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
}

gui.addColor(options, 'sphereColor').onChange((e) => {
    sphere.material.color.set(e);
})
gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
})
gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

let step = 0;

const mousePosition = new Vector2();
window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / window.innerHeight) * 2 - 1;
})
const rayCaster = new Raycaster();
const sphereId = sphere.id;
box2.name = 'theBox';
// console.log(sphereId)
function animate(time) {
console.log(mousePosition)

    setRotation(cube, { x: time / 1000, y: time / 1000 })
    setPosition(cube, { y: Math.sin(time / 1000) })

    step += options.speed;
    setPosition(sphere, { y: 10 * Math.abs(Math.sin(step)) });
    // spotLight.angle = options.angle;
    // spotLight.penumbra = options.penumbra;
    directionLight.intensity = options.intensity;
    dLightShadowHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.id === sphereId) {
            intersects[i].object.material.color.set(0xFF0000);
        }

        if(intersects[i].object.name === 'theBox') {
            setRotation(intersects[i].object, { x: time / 1000, y: time / 1000 })
        }
    }

    plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;


    renderer.render(scene, camera);
}

renderer.setAnimationLoop(render);
