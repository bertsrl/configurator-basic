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
      <loading-screen v-if="store.isLoading.value === true" />
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
        ></div>
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
import { onMounted, onBeforeUpdate, nextTick } from 'vue'
import * as THREE from 'three'
import * as dat from 'lil-gui'

import { ref, toRaw, watch, watchEffect } from 'vue'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as f from '@/components/Environment/functions'
import * as vTag from '@/components/Environment/vertexTag'
import * as settings from '@/components/Environment/Settings/'
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
import * as store from '@/store'
import * as meter from '@/components/Environment/Settings'
import LoadingScreen from '@/components/Environment/Init/LoadingScreen.vue'
import { tiBackLeft } from '@quasar/extras/themify'

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

const rendererRef = ref()
const controlsRef = ref()

const myPoints = ref()
myPoints.value = points

// Debug
const gui = new dat.GUI()

onMounted(async () => {
  store.isLoading.value = true

  const product_group = await computeProduct()
  product_group.scale.multiplyScalar(0.025)

  product_group.position.set(-1, -1, 0)
  product_group.rotation.y = Math.PI / 2

  f.scene.add(product_group)

  console.log(product_group)

  const morphMeshes = await f.unwrapChildren(product_group)
  morphMeshesRef.value = morphMeshes

  console.log(morphMeshes)

  console.log('boundingBoxes: ', boundingBoxes)
  const data = {
    scale: 0,
    boxScale: 1
  }
  // Map data.scale to box scale between 1/3 and 1
  const minBoxScale = 1 / 3
  const maxBoxScale = 1

  const mappedBoxScale = minBoxScale + data.scale * (maxBoxScale - minBoxScale)

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

  // Adding Loaded Mesh full version in the back as a dummy
  // f.addToScene(await f.addDummy())

  // Canvas
  const canvas = document.getElementById('canvas')!
  console.log(canvas)

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })

  rendererRef.value = renderer

  const parentElement = document.getElementById('parent-canvas')! // Replace with the actual ID or reference to the parent element

  f.resize(renderer, f.camera, f.sizes, parentElement)
  f.cursor(f.sizes, f.camera)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap

  // Controls
  const controls = new OrbitControls(f.camera, canvas)
  controls.enableDamping = true
  controlsRef.value = controls
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

  tick()
})

function tick() {
  //Update controls
  controlsRef.value.update()

  // Render
  rendererRef.value.render(f.scene, f.camera)

  window.requestAnimationFrame(tick)
}

onBeforeUpdate(async () => {
  setTimeout(() => {
    // Loading completed, set isLoading to false
    store.isLoading.value = false
  }, 1000) // Simulating a 3-second loading time, adjust as needed
})

const widthChanging = ref(false)
const heightChanging = ref(false)

watch(changeWidth, (newVal, oldVal) => {
  if (newVal !== oldVal && !heightChanging.value) {
    widthChanging.value = true

    for (const mesh of morphMeshesRef.value) {
      if (mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[0] = changeWidth.value
      }
    }

    // Map data.scale to box scale between 1/3 and 1
    const minBoxScale = 1 / 3
    const maxBoxScale = 1

    const mappedBoxScale = minBoxScale + changeWidth.value * (maxBoxScale - minBoxScale)

    mappedBoxScaleRef.value = mappedBoxScale

    for (const box of boundingBoxes) {
      box.scale.z = mappedBoxScaleRef.value
    }

    const mappedWidth = 1 + changeWidth.value

    console.log('boungingBoxes[0].width: ', boundingBoxes[0].scale.x, 'mappedWidth: ', mappedWidth)
    store.meters.x.scale.x = mappedWidth
    store.meters.y.position.x = store.windowRef.value.position.x + mappedWidth * 1.5
    store.textMeshes.windowHeightText.position.x = store.meters.y.position.x + 0.1
    store.units.width = changeWidth.value //TODO: De asociat cu intervalul pe care il da user-ul ca min max warranty

    meter.createText(store.units.width).then((newTextMesh) => {
      console.log(toRaw(store.textMeshes.windowWidthText))

      const oldText: THREE.Object3D = toRaw(store.textMeshes.windowWidthText)

      newTextMesh.position.copy(oldText.position)
      newTextMesh.scale.copy(oldText.scale)

      if (toRaw(store.textMeshes.windowWidthText)) {
        f.scene.remove(toRaw(store.textMeshes.windowWidthText))
        rendererRef.value.renderLists.dispose()
      }

      store.textMeshes.windowWidthText = newTextMesh
      f.scene.add(newTextMesh)
    })

    widthChanging.value = false
  }
})

watch(changeHeight, (newVal, oldVal) => {
  if (newVal !== oldVal && !widthChanging.value) {
    heightChanging.value = true

    for (const mesh of morphMeshesRef.value) {
      if (mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[1] = changeHeight.value
      }
    }

    // Map data.scale to box scale between 1/3 and 1
    const minBoxScale = 1 / 3
    const maxBoxScale = 1

    const mappedBoxScale = minBoxScale + changeHeight.value * (maxBoxScale - minBoxScale)

    mappedBoxScaleRef.value = mappedBoxScale

    for (const box of boundingBoxes) {
      box.scale.y = mappedBoxScaleRef.value
    }

    const mappedHeight = 1 + changeHeight.value

    console.log(
      'boungingBoxes[0].height: ',
      boundingBoxes[0].scale.y,
      'mappedHeight: ',
      mappedHeight
    )
    store.meters.y.scale.y = mappedHeight
    store.meters.x.position.y = store.windowRef.value.position.y + mappedHeight * 1.5
    store.textMeshes.windowWidthText.position.y = store.meters.x.position.y + 0.1
    store.units.height = changeHeight.value //TODO: De asociat cu intervalul pe care il da user-ul ca min max warranty

    meter.createText(store.units.height).then((newTextMesh) => {
      console.log('Running', toRaw(store.textMeshes.windowHeightText))

      const oldText: THREE.Object3D = toRaw(store.textMeshes.windowHeightText)

      newTextMesh.position.copy(oldText.position)
      newTextMesh.scale.copy(oldText.scale)

      if (toRaw(store.textMeshes.windowHeightText)) {
        f.scene.remove(toRaw(store.textMeshes.windowHeightText))
        rendererRef.value.renderLists.dispose()
      }

      store.textMeshes.windowHeightText = newTextMesh
      f.scene.add(newTextMesh)
    })

    heightChanging.value = false
  }
})
</script>
