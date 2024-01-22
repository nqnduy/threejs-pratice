
import * as dat from 'dat.gui';
import {
    Clock,
    IcosahedronGeometry,
    Mesh,
    PerspectiveCamera,
    Scene,
    ShaderMaterial,
    WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import noise from '@/glsl/noise/classicnoise3D';
import rotation from '@/glsl/rotate/rotateY';

let renderer,
    scene,
    camera,
    mesh,
    material,
    fov = 30,
    start = Date.now();

const settings = {
    speed: 0.2,
    density: 1.5,
    strength: 0.2,
    frequency: 3.0,
    amplitude: 6.0,
};

const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float displacement;
    uniform float time;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseDensity;
    uniform float uNoiseStrength;
    uniform float uFrequency;
    uniform float uAmplitude;

    ${noise}
    ${rotation}

    float turbulence( vec3 p ) {
        float w = 100.0;
        float t = -.9;

        for (float f = 1.0 ; f <= 10.0 ; f++ ){
            float power = pow( 2.0, f );
            t += abs(pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
        }

        return t;
    }

    void main() {
        vUv = uv;

        // get a turbulent 3d noise using the normal, normal to high freq
        float noise = 10.0 *  -.10 * turbulence( .5 * normal + time);
        // get a 3d noise using the position, low frequency
        float b = -3.0 * pnoise(0.05 * position + vec3(2.0 * time), vec3(100.0));
        // composeboth noises
        displacement = noise + b;

        // move the position along the normal and transform it
        // vec3 newPosition = position + normal * displacement;
        // gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

        float t = uTime * uSpeed;
        float distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;

        vec3 pos = position + (normal * distortion);
        float angle = sin(uv.y * uFrequency + t) * uAmplitude;
        pos = rotateY(pos, angle);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        vNormal = normal;
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float displacement;

    void main() {
        // compose the colour using the UV coordinate
        // and modulate it with the noise like ambient occlusion
        vec3 color = vec3(vNormal * displacement);
        gl_FragColor = vec4( color.rgb, 1.0);
        // gl_FragColor = vec4(vNormal, 1.0);
    }
`;
window.addEventListener('load', function () {
    const gui = new dat.GUI();

    const rotation = gui.addFolder('Rotation');
    rotation.add(settings, 'frequency', 0, 10, 0.1);
    rotation.add(settings, 'amplitude', 0, 10, 0.1);

    scene = new Scene();
    camera = new PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        .1,
        1000
    );
    camera.position.z = 5;

    // const clock = new Clock();

    material = new ShaderMaterial({
        // uniforms: {
        //     time: {
        //         type: 'f',
        //         value: 0.0
        //     }
        // },
        uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: settings.speed },
            uNoiseDensity: { value: settings.density },
            uNoiseStrength: { value: settings.strength },
            uFrequency: { value: settings.frequency },
            uAmplitude: { value: settings.amplitude },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })


    mesh = new Mesh(
        new IcosahedronGeometry(1, 64),
        material
    )

    scene.add(mesh);

    renderer = new WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor('black', 1);

    document.body.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    render();
})

function render() {
    material.uniforms['uTime'].value = .00025 * (Date.now() - start);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}




