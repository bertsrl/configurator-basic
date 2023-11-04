<style lang="scss">
@import '@/styles/quasar.variables.scss';

.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'navigation'
    'content';
  height: 100vh;
  color: #000;
  width: 100vw;
}

#content {
  grid-area: content;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'canvas'
    'settings';
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
  body {
    overflow: hidden;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      'navigation'
      'content';
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
    grid-template-areas: 'canvas settings';
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
    <div
      class="navigation"
      style="
        background-color: $primary;
        border-bottom: 1px solid #000;
        display: inline-flex;
        padding: 1vh 0 !important;
      "
    >
      <div class="q-bar--dense" style="background-color: rgba(0, 0, 0, 0.06); height: 2.5vh"></div>
      <div style="height: 7.5vh">
        <img src="/360config_logo.png" style="position: relative; max-height: 75%; margin: 10px" />
      </div>
      <helpers-control />
    </div>
    <div id="content">
      <div id="parent-canvas">
        <tools-control />
        <div
          style="
            position: absolute;
            bottom: 0;
            right: 32vw;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
          "
        >
          <!-- Other buttons -->
          <!-- <appendix-add
            v-for="(appendix, index) in appendixButtons"
            :key="index"
            :name="appendix.appendix.name"
            icon="arrow_up"
            style="grid-column: auto"
          /> -->
        </div>
        <scene-controller />
        <canvas id="canvas"></canvas>
      </div>
      <div class="settings" style="background-color: $secondary">
        <div class="settings-container q-pa-md">
          <h6>Customize Product</h6>
        </div>
        <div class="color-controls q-pa-md">
          <h6>Color Controls</h6>
          <!-- Create a color picker component -->
          <color-control :options="colorOptions" v-model:color_value="hex" />
          <p style="margin-top: 2vh">Selected color: {{ hex }}</p>
        </div>
        <div class="size-controls q-pa-md">
          <h6>Size Controls</h6>
          <size-control title="Width" v-model:size="changeWidth" />
          <size-control title="Height" v-model:size="changeHeight" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as dat from 'lil-gui'

import { ref, toRaw, watch, watchEffect } from 'vue'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as f from '@/components/Environment/functions'
import * as vTag from '@/components/Environment/vertexTag'
import { loadData } from '@/components/Environment/Products/LoadData'
import SizeControl from '@/components/Controls/SizeControl.vue'
import ColorControl from '@/components/Controls/ColorControl.vue'
import { points } from '@/components/Environment/points'
import ToolsControl from '@/components/Controls/ToolsControl.vue'
import { appendixButtons } from '@/components/Environment/Settings/appendixButton'
import AppendixAdd from '@/components/Controls/AppendixAdd.vue'
import SceneController from '@/components/Environment/Init/SceneController.vue'
import HelpersControl from '@/components/Controls/HelpersControl.vue'
import { computeProduct, boundingBoxes } from '@/components/Environment/Products/InitializeProduct'
import { instance } from 'three/examples/jsm/nodes/Nodes.js'

const hex = ref('green')
const colorOptions = ref([
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' }
])

const changeWidth = ref(0)
const changeHeight = ref(0)
const morphMeshesRef = ref()
const mappedBoxScaleRef = ref()

const myPoints = ref()
myPoints.value = points

// Debug
const gui = new dat.GUI()

onMounted(async () => {
  const product_group = await computeProduct()
  product_group.scale.multiplyScalar(0.025)

  product_group.position.set(-1, -1, 0)
  product_group.rotation.y = Math.PI / 2

  f.scene.add(product_group)

  console.log(product_group)

  const { morphMeshes } = f.unwrapChildren(product_group)
  morphMeshesRef.value = morphMeshes

  console.log(morphMeshes)

  console.log('boundingBoxes: ', boundingBoxes)
  const data = {
    scale: 0,
    boxScale: 1
  }

  for (const box of boundingBoxes) {
    box.scale.z = 1 / 3
    box.scale.y = 1 / 3
  }

  const scaleFolder = gui.addFolder('Scale')
  scaleFolder
    .add(data, 'scale', 0, 1)
    .step(0.01)
    .name('mesh 0 scale z')
    .onChange(() => {
      for (const mesh of morphMeshes) {
        if (mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
          mesh.morphTargetInfluences[0] = data.scale
          mesh.morphTargetInfluences[1] = data.scale

          const mappedBoxScale = minBoxScale + data.scale * (maxBoxScale - minBoxScale)

          mappedBoxScaleRef.value = mappedBoxScale

          // Apply scaled box scale to boundingBoxes
          for (const box of boundingBoxes) {
            box.scale.z = mappedBoxScale
            box.scale.y = mappedBoxScale
          }
        }
      }
    })

  scaleFolder
    .add(data, 'boxScale', 1, 3)
    .step(0.02)
    .name('boxScale')
    .onChange(() => {
      for (const box of boundingBoxes) {
        box.scale.z = data.boxScale / 3
        box.scale.y = data.boxScale / 3
      }
    })

  // Adding Loaded Mesh full version in the back as a dummy
  // f.addToScene(await f.addDummy())

  // Canvas
  const canvas = document.getElementById('canvas')!
  console.log(canvas)

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })

  const parentElement = document.getElementById('parent-canvas')! // Replace with the actual ID or reference to the parent element

  f.resize(renderer, f.camera, f.sizes, parentElement)
  f.cursor(f.sizes, f.camera)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap

  // Controls
  const controls = new OrbitControls(f.camera, canvas)
  controls.enableDamping = true
  // controls.maxPolarAngle = Math.PI / 2

  // // Set the minimum and maximum azimuthal angles
  // controls.minAzimuthAngle = -Math.PI / 2 // Minimum azimuthal angle (in radians)
  // controls.maxAzimuthAngle = Math.PI / 2 // Maximum azimuthal angle (in radians)

  console.log(appendixButtons)

  // for (const appendix of appendixButtons) {
  //   f.addToScene(appendix.appendix)
  //   // Calculate the average position of points at index 1 and index 2
  //   const avgPosition = new THREE.Vector3()
  //     .addVectors(appendix.point1, appendix.point2)
  //     .multiplyScalar(0.5)

  //   if (appendix.appendix instanceof THREE.Object3D) {
  //     // Check if points have the same Y value
  //     if (appendix.point1.y > 0 && appendix.point1.y === appendix.point2.y) {
  //       // Adjust the position based on Y value
  //       avgPosition.y += 0.5
  //     } else if (appendix.point1.y < 0 && appendix.point1.y === appendix.point2.y)
  //       avgPosition.y -= 0.5

  //     // Check if points have the same X value
  //     if (appendix.point1.x > 0 && appendix.point1.x === appendix.point2.x) {
  //       // Adjust the position based on Y value
  //       avgPosition.x += 0.5
  //     } else if (appendix.point1.x < 0 && appendix.point1.x === appendix.point2.x)
  //       avgPosition.x -= 0.5

  //     appendix.appendix.position.copy(avgPosition)
  //   }
  // }

  function tick() {
    for (const tag of vTag.vertexTags) {
      tag.lookAt(f.camera.position)
    }

    //Update controls
    controls.update()

    // Render
    renderer.render(f.scene, f.camera)

    window.requestAnimationFrame(tick)
  }
  tick()
})

watchEffect(() => {
  if (changeWidth.value) {
    for (const mesh of morphMeshesRef.value) {
      if (mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[0] = changeWidth.value

        // Map data.scale to box scale between 1/3 and 1
        const minBoxScale = 1 / 3
        const maxBoxScale = 1

        const mappedBoxScale = minBoxScale + changeWidth.value * (maxBoxScale - minBoxScale)

        mappedBoxScaleRef.value = mappedBoxScale

        for (const box of boundingBoxes) {
          box.scale.z = mappedBoxScaleRef.value
        }
      }
    }
  }
  if (changeHeight.value) {
    for (const mesh of morphMeshesRef.value) {
      if (mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[1] = changeHeight.value

        // Map data.scale to box scale between 1/3 and 1
        const minBoxScale = 1 / 3
        const maxBoxScale = 1

        const mappedBoxScale = minBoxScale + changeHeight.value * (maxBoxScale - minBoxScale)

        mappedBoxScaleRef.value = mappedBoxScale

        for (const box of boundingBoxes) {
          box.scale.y = mappedBoxScaleRef.value
        }
      }
    }
  }
})
</script>
