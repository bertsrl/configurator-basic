import * as THREE from 'three'
import * as dat from 'lil-gui'

import { boundingBoxesRef, productRefMorphMeshes } from '@/store'

import { loadData } from "./Products/LoadData"
import { toRaw } from 'vue'

// Sizes
export const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const gui = new dat.GUI();

export const scene = new THREE.Scene();

// Camera
export const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.01, 100)
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

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

export function cursor(sizes: {width: number, height: number}, camera?: THREE.Camera) {
    window.addEventListener('mousemove', (event) => {
        pointer.x = event.clientX / sizes.width - 0.5
        pointer.y = -(event.clientY / sizes.height) + 0.5
    
        raycaster.setFromCamera(pointer, camera!)
    })
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
        console.log(el)
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

export async function addDummy() {
    const product = await loadData('./models/Dora/AllProfiles.gltf')

    const productMesh = product.filter((a) => a && a.name)
  
    console.log("Profil: ", productMesh)
    for (const mesh of productMesh) {
      if (mesh instanceof THREE.Object3D) {
        // for(const child of mesh.children) {
        //     if(child instanceof THREE.Object3D) {
        //         child.scale.multiplyScalar(0.5)
        //     }
        // }
        
        mesh.position.z = -4
        mesh.scale.multiplyScalar(0.1)
        mesh.rotation.y = Math.PI / 2
      } 

    }

    return productMesh
} 

export function unwrapChildren(window: THREE.Object3D) {
  const morphMeshes = []
  console.log("window: ", window)

  for(const rehau_group of window.children) {
    if(rehau_group instanceof THREE.Object3D) {
      const rehau_profile = rehau_group.children[0]

      for(const rehau_component of rehau_profile.children) {
        if(rehau_component instanceof THREE.Object3D) {
          for(const mesh of rehau_component.children) {
            if(mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
              morphMeshes.push(mesh)
            }
          }
        }        
      }
    }
  }

  return { morphMeshes, boundingBoxesRef }
}