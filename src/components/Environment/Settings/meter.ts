import * as THREE from "three"
import * as f from "@/components/Environment/functions"
import * as store from "@/store";

import { ref, toRaw } from "vue"

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { loadFont } from "../Products/LoadData";

const fontRef = ref()

export async function provideMeterX(meshWidth: number, meshMiddle: THREE.Vector3) {
    
    //barometer mesh
    const geometry = new THREE.BoxGeometry( meshWidth, 0.01, 0.01 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
    const cube = new THREE.Mesh( geometry, material ); 

    cube.position.set(meshMiddle.x, meshMiddle.y + 1.5, meshMiddle.z)
    
    //text mesh
    fontRef.value = await loadFont("./fonts/helvetiker_bold.typeface.json");
    
    const textMesh = await createText(0)

    textMesh.position.copy(cube.position)
    textMesh.position.y += 0.1
    textMesh.scale.multiplyScalar(0.005)

    store.textMeshes.windowWidthText = textMesh

    f.scene.add(toRaw(store.textMeshes.windowWidthText))

    return cube;
}

export async function provideMeterY(meshHeigh: number, meshMiddle: THREE.Vector3) {
    const geometry = new THREE.BoxGeometry( 0.01, meshHeigh, 0.01 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
    const cube = new THREE.Mesh( geometry, material ); 

    cube.position.set(meshMiddle.x + 1.5, meshMiddle.y, meshMiddle.z)
    
    fontRef.value = await loadFont("./fonts/helvetiker_bold.typeface.json");
    const textMesh = await createText(0)

    textMesh.position.copy(cube.position)
    textMesh.position.x += 0.1
    textMesh.scale.multiplyScalar(0.005)

    store.textMeshes.windowHeightText = textMesh

    f.scene.add(toRaw(store.textMeshes.windowHeightText))
    
    return cube;
}

export function updateMeterX(window: THREE.Object3D) {
    const box3 = new THREE.Box3().setFromObject(window)

    const dimension = new THREE.Vector3()
    box3.getSize(dimension)

    store.meters.x.scale.x = dimension.x / 2
}

export async function createText(units: number) {    
    //text mesh
    const geometryText = new TextGeometry( `${units} mm`, {
		font: fontRef.value,
		size: 20,
		height: 5,
		curveSegments: 12,
	} );

    const textMesh = new THREE.Mesh( 
        geometryText,
        new THREE.MeshBasicMaterial({ color: 0x000000})
    );

    return new Promise<THREE.Mesh>((resolve) => {
        resolve(textMesh)
    })
}