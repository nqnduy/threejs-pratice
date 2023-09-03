import { AudioLoader, TextureLoader, FileLoader, Object3D } from 'three';
import { getFileExtension } from '@/utils';

export default async function assetLoader(url) {
    if (!url) return null;

    const ext = getFileExtension(url);

    let loader;

    switch (ext?.toLowerCase()) {
        case 'svg':
            const SVGLoader = (await import('three/examples/jsm/loaders/SVGLoader')).SVGLoader;
            loader = new SVGLoader();
            break;

        case 'fbx':
            const FBXLoader = (await import('three/examples/jsm/loaders/FBXLoader')).FBXLoader;
            loader = new FBXLoader();
            break;

        case 'glb':
        case 'gltf':
            const GLTFLoader = (await import('three/examples/jsm/loaders/GLTFLoader')).GLTFLoader;
            loader = new GLTFLoader();
            break;

        case 'obj':
            const OBJLoader = (await import('three/examples/jsm/loaders/OBJLoader')).OBJLoader;
            loader = new OBJLoader();
            break;

        case 'mp3':
            loader = new AudioLoader();
            break;

        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'jpe':
        case 'webp':
            loader = new TextureLoader();
            break;

        default:
            loader = new FileLoader();
            break;
    }

    const res = await loader.loadAsync(url);
    if (res) {
        //
        let obj;
        if (res.hasOwnProperty('scene')) {
            obj = new Object3D();
            res.scene.scale.setScalar(100);
            obj.add(res.scene);
            obj.animations = res.animations;
        } else {
            obj = res;
        }
        return obj;
    }
    return null;
}
