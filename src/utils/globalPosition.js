import { Object3D, Vector3 } from 'three';

export default function globalPosition(obj: Object3D) {
    const vector = new Vector3();

    if (obj) {
        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
    }
    return vector;
}
