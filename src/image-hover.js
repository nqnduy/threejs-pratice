import {
    Mesh,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    TextureLoader,
    Vector2,
    WebGLRenderer
} from "three";

const imageContainer = document.querySelector('.imageContainer');
const imageEl = document.querySelector('.imageContainer img');
let rect = imageContainer.getBoundingClientRect();

let scene, camera, planeMesh, renderer;
let easeFactor = .02;
let mousePosition = { x: .5, y: .5 };
let targetMousePosition = { x: .5, y: .5 };
let aberrationIntensity = .0;
let lastPosition = { x: 0.5, y: 0.5 };
let prevPosition = { x: 0.5, y: 0.5 };

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform float u_aberrationIntensity;

    void main() {
        vec2 gridUV = floor(vUv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
        vec2 centerOfPixel = gridUV + vec2(1.0/20.0, 1.0/20.0);

        vec2 mouseDirection = u_mouse - u_prevMouse;

        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

        vec2 uvOffset = strength * - mouseDirection * 0.2;
        vec2 uv = vUv - uvOffset;

        vec4 colorR = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
        vec4 colorG = texture2D(u_texture, uv);
        vec4 colorB = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));

        gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, 1.0);
    }
`;

function initializeScene(texture) {
    scene = new Scene();

    camera = new PerspectiveCamera(
        80,
        imageEl.offsetWidth / imageEl.offsetHeight,
        .01,
        10
    )

    camera.position.set(0, 0, 1);

    let shaderUniforms = {
        u_mouse: { type: "v2", value: new Vector2() },
        u_prevMouse: { type: "v2", value: new Vector2() },
        u_aberrationIntensity: { type: "f", value: 0.0 },
        u_texture: { type: "t", value: texture }
    };

    planeMesh = new Mesh(
        new PlaneGeometry(2, 2),
        new ShaderMaterial({
            uniforms: shaderUniforms,
            vertexShader,
            fragmentShader
        })
    )
    scene.add(planeMesh);

    renderer = new WebGLRenderer();
    renderer.setSize(imageEl.offsetWidth, imageEl.offsetHeight);
    imageContainer.append(renderer.domElement);
}

initializeScene(new TextureLoader().load(imageEl.src));

animateScene();
function animateScene() {
    requestAnimationFrame(animateScene);

    mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
    mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

    planeMesh.material.uniforms.u_mouse.value.set(
        mousePosition.x,
        1.0 - mousePosition.y
    );

    planeMesh.material.uniforms.u_prevMouse.value.set(
        prevPosition.x,
        1.0 - prevPosition.y
    );

    aberrationIntensity = Math.max(.0, aberrationIntensity - .05);
    planeMesh.material.uniforms.u_aberrationIntensity.value = aberrationIntensity
    renderer.render(scene, camera);
}

imageContainer.addEventListener("mousemove", mouseMove);
imageContainer.addEventListener("mouseenter", mouseEnter);
imageContainer.addEventListener("mouseleave", mouseLeave);

function mouseMove(event) {
    easeFactor = 0.02;
    prevPosition = { ...targetMousePosition };

    targetMousePosition.x = (event.clientX - rect.left) / rect.width;
    targetMousePosition.y = (event.clientY - rect.top) / rect.height;

    aberrationIntensity = 1;
}

function mouseEnter(event) {
    easeFactor = 0.02;

    mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width;
    mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height;
}

function mouseLeave() {
    easeFactor = 0.05;
    targetMousePosition = { ...prevPosition };
}

