<style lang="scss">
@import '@/styles/quasar.variables.scss';

.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "navigation"
    "content" ;
  height: 100vh;
  color: #000;
  width: 100vw;
}

#content {
  grid-area: content;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 
  "canvas" 
  "settings";
  width: 100%;
}

.navigation {
  grid-area: navigation;
  width: 100%;
  background-color: $primary;
}

#canvas {
  grid-area: canvas;
  height: 100% !important;
  width: 100vw !important;
}

.parent-canvas {
  height: 500px !important;
}

.settings {
  grid-area: settings;
  width: 100vw;
  height: 100vh;
  background-color: $primary;
}


@media only screen and (min-width: 992px) {
  .container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "navigation"
      "content";
    height: 100vh;
    color: #000;
    width: 100vw;
  }

  .navigation {
    grid-area: navigation;
    width: 100%;
  }

  #content {
    grid-area: content;
    display: grid;
    grid-template-columns: 70% 30%;
    grid-template-areas: "canvas settings";
    width: 100%;
  }

  #canvas {
    grid-area: canvas;
    height: 100vh !important;
    width: 100% !important;
  }

  .settings {
    grid-area: settings;
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <div class="container">
    <div class="navigation"  style="background-color: $primary; border-bottom: 1px solid #000;">
      <div class="q-bar--dense" style="background-color: rgba(0, 0, 0, .06); height: 2.5vh;"></div>
      <div style="height: 4.5vh;"></div>
    </div>
    <div id="content">
      <div id="parent-canvas">
        <canvas id="canvas"></canvas>
      </div>
      <div class="settings" style="background-color: $secondary;">
        <div class="settings-container q-pa-md" >
           <h6>Customize Product</h6>
        </div>
        <div class="color-controls q-pa-md">
            <h6>Color Controls</h6>
            <!-- Create a color picker component -->
            <color-control :options="colorOptions" v-model:color_value="hex" />
            <p style="margin-top: 2vh;">Selected color: {{ hex }}</p>
          </div>
          <div class="size-controls q-pa-md" >
            <h6>Size Controls</h6>
            <size-control title="Width" v-model:size="initialWidth"/>
            <size-control title="Height" v-model:size="initialHeight"/>
            <size-control title="Depth" v-model:size="initialDepth"/>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as THREE from 'three'
import * as dat from 'lil-gui'

import { ref } from 'vue'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { resize, cursor } from './functions'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import SizeControl from './Controls/SizeControl.vue'
import ColorControl from './Controls/ColorControl.vue'

const hex = ref('green');
const colorOptions = ref([
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' }
])

const initialWidth = ref(20);
const initialHeight = ref(5);
const initialDepth = ref(45);
/**
 * Base
 */
THREE.ColorManagement.enabled = false

// // Debug
// const gui = new dat.GUI()

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

  const parentElement = document.getElementById('parent-canvas')!; // Replace with the actual ID or reference to the parent element

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

  resize(renderer, camera, sizes, parentElement)
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
  './models/window_gltf/window_good3.gltf',
  (gltf) =>
  {
      gltf.scene.scale.set(0.025, 0.025, 0.025);
      gltf.scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        // Access the 'material' property for Mesh objects
        // child.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
        // const folder = gui.addFolder( child.name );
        // folder.addColor(child.material, 'color');
      
      }
      else if (child instanceof THREE.Object3D) {
        if(child.children[1] instanceof THREE.Mesh && child.children.length > 0) {
          // const folder = gui.addFolder( child.name );
          // folder.addColor(child.children[1].material, 'color');
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
