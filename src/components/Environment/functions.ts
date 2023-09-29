import * as THREE from 'three'
import * as dat from 'lil-gui'

import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Wireframe } from 'three/examples/jsm/lines/Wireframe.js';
import { appendixButtons } from './Settings/appendixFrame'
import { points } from './points'
import { toRaw } from 'vue'

const gui = new dat.GUI();

export const scene = new THREE.Scene();

// Sizes
export const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

export const pointer = new THREE.Vector2()
export const raycaster = new THREE.Raycaster()

export function resize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, sizes: { width: number, height: number }, parentElement: HTMLElement) {
    
    const updateRendererSize = () => {
        const rect = parentElement.getBoundingClientRect();
        
        // Update sizes
        sizes.width = rect.width;
        sizes.height = rect.height;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    // Initial call to set sizes
    updateRendererSize();

    // Update on window resize
    window.addEventListener('resize', updateRendererSize);
    
}

export function cursor(sizes: {width: number, height: number}, camera: THREE.Camera) {
    window.addEventListener('mousemove', (event) => {
        pointer.x = event.clientX / sizes.width - 0.5
        pointer.y = -(event.clientY / sizes.height) + 0.5
    
        raycaster.setFromCamera(pointer, camera)
    })
}
/**
 * 
 * @returns BoundingBoxes[<Object3D>]
 */
export function computeBoundingBoxes(fillMesh: THREE.Object3D, cornerMesh?: THREE.Object3D) {
    const boundingBoxes = [];
    const fillMeshes = [];
    const intersectMeshes = [];
    const corners = [];
    
    for (let i = 0; i < points.length - 1; i++) {
    
       // Define the endpoints of the line segment
        const start = points[i];
        const end = points[i + 1];

            // Calculate the length and direction of the line segment
        const lineLength = start.distanceTo(end)

        // Create a box geometry for the bounding box
        const boxGeometry = new THREE.BoxGeometry(0.2, 0.2, lineLength-0.4);

        /**
         * @abstract Create bounding boxes for each line segment
         */

        // Create a mesh for the bounding box
        const boundingBoxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));

        // Position the bounding box at the center of the line segment
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5); // MEDIA ARITMETICA DINTRE NUMERE
        boundingBoxMesh.position.copy(midpoint);

        // Create a texture and set its repeat values
        const texture = new THREE.TextureLoader().load('./textures/Wood_023_roughness.jpg');
        texture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
        texture.wrapT = THREE.RepeatWrapping; // Repeat vertically
        texture.repeat.set(10, 10); // Number of times to repeat in each direction (adjust as needed)

        /**
         * @constant fill-up the bounding boxes
         */
        
        const fill = fillMesh.clone()
        fill.position.copy(midpoint)
        fill.scale.x = 0.1;
        fill.scale.y = 0.1;
        
        fill.lookAt(end) 
        fill.material.map = texture;
        fill.material.transparent = true;
        fill.material.opacity = 0.4;

        if(cornerMesh) {
            const corner = cornerMesh.clone()
            corner.position.copy(points[i])
            corner.scale.set(0.1, 0.1, 0.1)
            
            fill.scale.z = boundingBoxMesh.scale.z / 2;
            corners.push(corner)
            fillMeshes.push(corner)
        }
      
        // Rotate the bounding box to align with the line's direction
        boundingBoxMesh.lookAt(end);
        
        // scene.add(boundingBoxMesh, fill)

        boundingBoxes.push(boundingBoxMesh);
        fillMeshes.push(fill)
    }

    return {
        boundingBoxes,
        fillMeshes,
        intersectMeshes,
        corners
    }
}

export function addToScene(element?: THREE.Object3D | THREE.Object3D[]) {
    if (element) {
        if (Array.isArray(element)) {
            // Handle the case where 'element' is an array of 'THREE.Object3D' objects
            for (const obj of element) {
                if (obj instanceof THREE.Object3D) {
                    scene.add(obj)
                }
            }
        } else if (element instanceof THREE.Object3D) {
            scene.add(element)
        }
    }
}

export function toggleHelpersFn(array: THREE.Object3D[], itsToggle: boolean) {    
    console.log(itsToggle, " boolean")
    const elements = toRaw(array)
    console.log("Array: ", elements)
    for(const el of elements) {
        if(el instanceof THREE.Object3D) {
          if(itsToggle === true) {
            el.visible = false;
          } else {
            el.visible = true;
          }
        }
      }
      
    console.log(itsToggle)
  }

