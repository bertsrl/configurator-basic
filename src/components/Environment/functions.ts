import * as THREE from 'three'
import * as dat from 'lil-gui'
import * as settings from './Settings/'
import * as store from '@/store'

import { gsap } from "gsap"
import { loadData } from "./Products/LoadData"
import { toRaw } from 'vue'

// Sizes
export const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


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
    const elements = toRaw(array)
    for(const el of elements) {
        if(el instanceof THREE.Object3D) {
          if(itsToggle === true) {
            el.visible = false;
          } else {
            el.visible = true;
          }
        }
      }
  }

export async function addDummy() {
    const product = await loadData('./models/Dora/AllProfiles.gltf')

    const productMesh = product.filter((a) => a && a.name)
  
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

export function addKeepOffset(parentObject: THREE.Object3D, childObject: THREE.Object3D) {
   // Assuming 'parentObject' is the target THREE.Object3D
  // and 'childObject' is the object you want to add

  // Step 1: Get the World Position and Rotation
  const worldPosition = new THREE.Vector3();
  const worldQuaternion = new THREE.Quaternion();
  const worldScale = new THREE.Vector3();

  childObject.getWorldPosition(worldPosition);
  childObject.getWorldQuaternion(worldQuaternion);
  childObject.getWorldScale(worldScale);

  // Step 2: Add the Object as a Child
  parentObject.add(childObject);

  // Step 3: Set the World Position and Rotation
  childObject.position.copy(worldPosition);
  childObject.quaternion.copy(worldQuaternion);
  childObject.scale.copy(worldScale);
}

const profileMiddle = new THREE.Vector3()

export async function unwrapChildren(window: THREE.Object3D) {
  const morphMeshes = []
  
  const box3 = new THREE.Box3().setFromObject(window)

  const dimension = new THREE.Vector3()
  box3.getSize(dimension)
  
  window.position.set(-2.7, 0, 0)


  // const geometry = new THREE.SphereGeometry(1, 32, 16)
  // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  // const sphere = new THREE.Mesh(geometry, material)
  // window.children[0].add(sphere)

  // sphere.position.z -= 25
  // sphere.position.y -= 25

  // sphere.getWorldPosition(profileMiddle)


  

  
  const meterX = await settings.provideMeterX(dimension.x / 2, window.position) 
  const meterY = await settings.provideMeterY(dimension.y / 2, window.position) 

  scene.add(meterX)
  scene.add(meterY)
  
  // window.add(meterX, meterY)
  // window.add(toRaw(store.textMeshes.windowHeightText), toRaw(store.textMeshes.windowWidthText))

  // store.textMeshes.windowHeightText.scale.set(0.35, 0.35, 0.35)
  // store.textMeshes.windowWidthText.scale.set(0.35, 0.35, 0.35)

  // store.textMeshes.windowHeightText.rotation.y -= Math.PI / 2
  // store.textMeshes.windowWidthText.rotation.y -= Math.PI / 2

  // store.textMeshes.windowHeightText.position.y += 70
  // store.textMeshes.windowWidthText.position.z += 70

  // console.log("Window: ", window)
  
  // meterX.scale.set(40, 50, 50)
  // meterY.scale.set(50, 40, 50)

  // meterX.position.z += 62
  // meterY.position.y += 62

  // meterX.rotation.y += Math.PI / 2
  // meterX.rotation.z += Math.PI / 2
  // meterY.rotation.x += Math.PI / 2
  
  store.meters.x = meterX
  store.meters.y = meterY
  
  console.log("window: ", window)
  store.windowRef.value = window 
  
  let index = 0;

  const params = {
    envMap: 'HDR',
    roughness: 0.4,
    metalness: 0.6,
    reflectivity: 1,
    exposure: 1.0,
    debug: false
  };
  
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
    
    if(index===3) break;
    index++;
  }

  return morphMeshes
}

export async function provideProfileView() {
  
  // store.isLoading.value = true
  
  // store.windowRef.value.children[0].children[0].children[1].visible = false
  // store.windowRef.value.children[0].children[0].children[2].visible = false
  
  store.windowRef.value.children[1].visible = false;
  store.windowRef.value.children[2].visible = false;
  store.windowRef.value.children[3].visible = false;

  console.log(store.windowRef.value)
  
  store.windowRef.value.children[4].scale.y /= 2
  store.windowRef.value.children[4].scale.z /= 2
  
  store.windowRef.value.children[4].position.y -= 22.8 
  store.windowRef.value.children[4].position.z -= 22.5

  // store.windowRef.value.children[4].scale.x -= 0.1

  // console.log("Profile: ", toRaw(store.windowRef.value))
  
  // store.windowRef.value.children[0].position.y += 22.8
  // store.windowRef.value.children[0].position.z += 22.5
  // store.windowRef.value.children[0].position.x += 0.1
  
  // store.windowRef.value.children[0].position.z += 23
  // store.windowRef.value.children[0].position.y += 23
  
  store.isMetricsEnabled.value = false
  
  // camera.lookAt(new THREE.Vector3(0, 5, 0))
  
  setTimeout(() => {
    // Loading completed, set isLoading to false
    store.isLoading.value = false
  }, 1300) // Simulating a 3-second loading time, adjust as needed
  
} 
export async function provideWindowView() {
  
  store.windowRef.value.children[1].visible = true;
  store.windowRef.value.children[2].visible = true;
  store.windowRef.value.children[3].visible = true;

  console.log(store.windowRef.value)
  
  store.windowRef.value.children[4].position.y += 22.8 
  store.windowRef.value.children[4].position.z += 22.5
  
  store.isMetricsEnabled.value = true

  setTimeout(() => {
    // Loading completed, set isLoading to false
    store.isLoading.value = false
  }, 1300) // Simulating a 3-second loading time, adjust as needed
  
} 
