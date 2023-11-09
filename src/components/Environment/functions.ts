import * as THREE from 'three'
import * as dat from 'lil-gui'
import * as settings from './Settings/'
import * as store from '@/store'

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

export async function unwrapChildren(window: THREE.Object3D) {
  const morphMeshes = []
  console.log("window: ", window)
  
  const box3 = new THREE.Box3().setFromObject(window)

  const dimension = new THREE.Vector3()
  box3.getSize(dimension)
  
  console.log("window dimension: ",dimension)

  window.position.set(0, 0, 0)
  
  const meterX = await settings.provideMeterX(dimension.x / 2, window.position) 
  const meterY = await settings.provideMeterY(dimension.y / 2, window.position) 

  scene.add(meterX)
  scene.add(meterY)
  
  store.meters.x = meterX
  store.meters.y = meterY

  console.log("store.meters: ", store.meters.x, store.meters.y)
  store.windowRef.value = window 

  let index = 0;
  
  for(const rehau_group of window.children) {
    if(rehau_group instanceof THREE.Object3D) {
      const rehau_profile = rehau_group.children[0]

      for(const rehau_component of rehau_profile.children) {
        if(rehau_component instanceof THREE.Object3D) {
        
          if(rehau_component.name === "Corner" && (index == 1 || index == 3)) {
            rehau_component.children[0].visible = false;
            rehau_component.children[1].visible = false;
          }
          
          for(const mesh of rehau_component.children) {
            if(mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
              morphMeshes.push(mesh)
            }
          }
        }        
      }
    }

    index++;
  }

  return morphMeshes
}

export async function provideProfileView() {

  console.log("store.profileRef.value: ", store.profileRef.value)
  
  store.isLoading.value = true
  
  store.windowRef.value.children[1].visible = false;
  store.windowRef.value.children[2].visible = false;
  store.windowRef.value.children[3].visible = false;
  
  store.windowRef.value.children[4].scale.y /= 2
  store.windowRef.value.children[4].scale.z /= 2
  
  store.windowRef.value.children[0].position.z += 23
  store.windowRef.value.children[0].position.y += 23
  
  store.textMeshes.windowWidthText = false
  store.textMeshes.windowHeightText = false

  setTimeout(() => {
    // Loading completed, set isLoading to false
    store.isLoading.value = false
  }, 1300) // Simulating a 3-second loading time, adjust as needed
  
} 