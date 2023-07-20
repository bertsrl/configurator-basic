<template>
  <div>
    <canvas id="canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as THREE from 'three'
import * as dat from 'lil-gui'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { resize, cursor } from './functions'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
THREE.ColorManagement.enabled = false

// Debug
const gui = new dat.GUI()

onMounted(() => {
  // Canvas
  const canvas = document.getElementById('canvas')!
  console.log(canvas)
  
  // Scene
  const scene = new THREE.Scene()

  // Renderer
  const renderer = new THREE.WebGLRenderer({
      canvas: canvas
  })

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  // const aspectRatio = sizes.width / sizes.height
  // const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

  camera.position.z = 3 
  scene.add(camera)

    //Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

  resize(renderer, camera, sizes)
  cursor(sizes)

  // Plane
  const plane = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.5, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
  )

  plane.material.transparent = true;
  plane.material.opacity = 0.5
  plane.position.y = -1
  scene.add(plane)
  
const gltfLoader = new GLTFLoader()

gltfLoader.load(
  '/models/window_gltf/window_good3.gltf',
  (gltf) =>
  {
      gltf.scene.scale.set(0.025, 0.025, 0.025);
      gltf.scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        // Access the 'material' property for Mesh objects
        // child.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
        const folder = gui.addFolder( child.name );
        folder.addColor(child.material, 'color');
      
      }
      else if (child instanceof THREE.Object3D) {
        if(child.children[1] instanceof THREE.Mesh && child.children.length > 0) {
          const folder = gui.addFolder( child.name );
          folder.addColor(child.children[1].material, 'color');
        }
      }
});
      scene.add(...gltf.scene.children)
  }
) 

const outerEnvironmentMap = new THREE.CubeTextureLoader().load([
  '/models/environment_map/posx.jpg',  
  '/models/environment_map/negx.jpg',
  '/models/environment_map/posy.jpg',
  '/models/environment_map/negy.jpg',
  '/models/environment_map/posz.jpg',
  '/models/environment_map/negz.jpg'
])

outerEnvironmentMap.encoding = THREE.sRGBEncoding

scene.background = outerEnvironmentMap
scene.environment = outerEnvironmentMap

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  const tick = () =>
  {
      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
  }

  tick()
})
</script>
