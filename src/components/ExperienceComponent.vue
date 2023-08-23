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
  html,
  body
  {
      overflow: hidden;
  }

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
      <div style="height: 7.5vh;">
        <img src="/360config_logo.png" style="position: relative; max-height: 75%; margin: 10px"/>
      </div>
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
import { loadData } from './Products/LoadData.ts'
import SizeControl from './Controls/SizeControl.vue'
import ColorControl from './Controls/ColorControl.vue'
import { element, instance } from 'three/examples/jsm/nodes/Nodes.js';

const hex = ref('green');
const colorOptions = ref([
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' }
])

const initialWidth = ref(0.01);
const initialHeight = ref(0.005);
const initialDepth = ref(0.01);

/**
 * Base
 */
THREE.ColorManagement.enabled = false

// // Debug
const gui = new dat.GUI()

onMounted(async () => {
  const productMesh = await loadData('./models/door/correct_door11.gltf')

  console.log(productMesh)

  // Canvas
  const canvas = document.getElementById('canvas')!
  console.log(canvas)

  // Scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xdedede)
  scene.fog = new THREE.Fog(0xdedede, 1, 5)
  
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
  const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
  // const aspectRatio = sizes.width / sizes.height
  // const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

  camera.position.set(-1, 1, -1)
  scene.add(camera)

  //Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)

  scene.add(ambientLight)

  resize(renderer, camera, sizes, parentElement)
  cursor(sizes)

  //Product
  scene.add(...productMesh)
  
  
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

 //Create a PointLight and turn on shadows for the light
  const light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 0, 1, -0.5 );
  light.castShadow = true; // default false
  scene.add( light );

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

  // //Create a sphere that cast shadows (but does not receive them)
  // const sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
  // const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
  // const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  // sphere.position.y = 0.05
  // sphere.castShadow = true; //default is false
  // sphere.receiveShadow = false; //default
  // scene.add( sphere );

  //Create a plane that receives shadows (but does not cast them)
  const planeGeometry = new THREE.PlaneGeometry( 20, 20, 32, 32 );
  const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xdedede } )
  const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.position.y = 0
    plane.rotation.x = - Math.PI / 2;
  plane.receiveShadow = true;
  scene.add( plane );
  
  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.maxPolarAngle = 1.45

  function tick()
  {
      //Update product customization
      productMesh.forEach(element => {
        element.scale.set(initialDepth.value, initialHeight.value, initialWidth.value) // TODO: De stabilit un pattern la mesh-urile produselor pentru a nu schimba parametrii astia mai tarziu
        element.children.forEach(child => {
          if(child instanceof THREE.Mesh && child.name === "DoorBase") {
            child.material.color = new THREE.Color( hex.value );
            child.castShadow = true;
          }
        });
      });

      plane.receiveShadow = true;
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
