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
      <q-btn-group rounded>
        <q-btn
          color="green-6"
          rounded
          glossy
          :icon-right="toggleBoundingBoxes === true ? 'visibility' : 'visibility_off'"
          label="Bounding Boxes"
          @click="
            () => {
              f.toggleHelpersFn(boundingBoxesRef, toggleBoundingBoxes)
              toggleBoundingBoxes = toggleBoundingBoxes === true ? false : true
            }
          "
        />
        <q-btn
          color="green-8"
          rounded
          glossy
          :icon-right="toggleVertexTags === true ? 'visibility' : 'visibility_off'"
          label="Vertex Tags"
          @click="
            () => {
              f.toggleHelpersFn(vertexTagsRef, toggleVertexTags)
              toggleVertexTags = toggleVertexTags === true ? false : true
            }
          "
        />
        <q-btn
          color="green-10"
          rounded
          glossy
          :icon-right="toggleFill === true ? 'visibility' : 'visibility_off'"
          label="Fill"
          @click="
            () => {
              f.toggleHelpersFn(fillMeshesRef, toggleFill)
              toggleFill = toggleFill === true ? false : true
            }
          "
        />
      </q-btn-group>
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
          <div></div>
          <div></div>

          <!-- Other buttons -->
          <appendix-add
            v-for="(appendix, index) in appendixButtons"
            :key="index"
            :name="appendix.appendix.name"
            icon="arrow_up"
            style="grid-column: auto"
          />
        </div>
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
import { appendixButtons } from '@/components/Environment/Settings/appendixFrame'
import AppendixAdd from '@/components/Controls/AppendixAdd.vue'
import * as settings from '@/components/Environment/Settings/index'

import TWEEN from '@tweenjs/tween.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { biBoundingBox } from '@quasar/extras/bootstrap-icons'
import { write } from 'fs'

const hex = ref('green')
const colorOptions = ref([
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' }
])

const changeWidth = ref(0)
const changeHeight = ref(0)

const toggleBoundingBoxes = ref(true)
const toggleVertexTags = ref(true)
const toggleFill = ref(true)

const boundingBoxesRef = ref()
const fillMeshesRef = ref()
const vertexTagsRef = ref()
const intersectMeshesRef = ref()
const cornersRef = ref()

// Create a ref for the points array
const pointsRef = ref([])
// Create a ref for the Three.js line
const lineRef = ref()

/**
 * Base
 */
THREE.ColorManagement.enabled = false
THREE.Cache.enabled = true

// Debug
const gui = new dat.GUI()

onMounted(async () => {
  // Create an axis helper
  const axisHelper = new THREE.AxesHelper(0.4)

  f.addToScene(axisHelper)

  const product = await loadData('./models/new_tests/corner_profile3.gltf')

  const productMesh = product.filter((a) => a && a.name)

  for (const mesh of productMesh) {
    if (mesh instanceof THREE.Object3D) mesh.position.z = -4
    mesh.scale.set(0.4, 0.4, 0.4)
    mesh.rotation.y = Math.PI / 2

    // mesh.rotation.y = -Math.PI
    f.addToScene(mesh)
  }

  console.log('product: ', product)
  console.log('productMesh: ', productMesh)

  // Canvas
  const canvas = document.getElementById('canvas')!
  console.log(canvas)

  // Scene
  f.scene.background = new THREE.Color(0xdedede)
  // f.scene.fog = new THREE.Fog(0xdedede, 1, 5)

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })

  const parentElement = document.getElementById('parent-canvas')! // Replace with the actual ID or reference to the parent element

  // Camera
  const camera = new THREE.PerspectiveCamera(20, f.sizes.width / f.sizes.height, 0.01, 100)
  // const aspectRatio = sizes.width / sizes.height
  // const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

  camera.position.set(0, 0, 5)
  f.addToScene(camera)

  f.resize(renderer, camera, f.sizes, parentElement)
  f.cursor(f.sizes, camera)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap

  f.addToScene(settings.ambientLight)
  f.addToScene(settings.light)

  f.addToScene(settings.plane)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.maxPolarAngle = Math.PI / 2

  // Set the minimum and maximum azimuthal angles
  controls.minAzimuthAngle = -Math.PI / 2 // Minimum azimuthal angle (in radians)
  controls.maxAzimuthAngle = Math.PI / 2 // Maximum azimuthal angle (in radians)

  vertexTagsRef.value = vTag.vertexTags

  const { boundingBoxes, fillMeshes, intersectMeshes, corners } = f.computeBoundingBoxes(
    productMesh[0].children[2],
    productMesh[0].children[0]
  )

  boundingBoxesRef.value = toRaw(boundingBoxes)
  fillMeshesRef.value = toRaw(fillMeshes)
  intersectMeshesRef.value = toRaw(intersectMeshes)
  cornersRef.value = toRaw(corners)

  //TODO: transform this into one fn

  corners[0].rotation.y = Math.PI / 2
  corners[0].rotation.x = Math.PI

  corners[1].rotation.y = -Math.PI / 2
  corners[1].rotation.x = Math.PI

  corners[2].rotation.y = -Math.PI / 2

  corners[3].rotation.y = Math.PI / 2

  for (const corner of corners) {
    if (corner instanceof THREE.Object3D) {
      const box3 = new THREE.Box3().setFromObject(corner)

      const dimension = new THREE.Vector3()
      box3.getSize(dimension)

      const boundingIntesect = new THREE.Mesh(
        new THREE.BoxGeometry(dimension.x, dimension.y, dimension.z),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
      )

      corner.getWorldPosition(boundingIntesect.position)

      boundingBoxes.push(boundingIntesect)
    }
  }

  f.addToScene(fillMeshes)
  f.addToScene(vTag.vertexTags)
  f.addToScene(intersectMeshes)
  f.addToScene(boundingBoxes)
  f.addToScene(corners)

  console.log(appendixButtons)

  for (const appendix of appendixButtons) {
    f.addToScene(appendix.appendix)
    // Calculate the average position of points at index 1 and index 2
    const avgPosition = new THREE.Vector3()
      .addVectors(appendix.point1, appendix.point2)
      .multiplyScalar(0.5)

    if (appendix.appendix instanceof THREE.Object3D) {
      // Check if points have the same Y value
      if (appendix.point1.y > 0 && appendix.point1.y === appendix.point2.y) {
        // Adjust the position based on Y value
        avgPosition.y += 0.5
      } else if (appendix.point1.y < 0 && appendix.point1.y === appendix.point2.y)
        avgPosition.y -= 0.5

      // Check if points have the same X value
      if (appendix.point1.x > 0 && appendix.point1.x === appendix.point2.x) {
        // Adjust the position based on Y value
        avgPosition.x += 0.5
      } else if (appendix.point1.x < 0 && appendix.point1.x === appendix.point2.x)
        avgPosition.x -= 0.5

      appendix.appendix.position.copy(avgPosition)

      // const box3 = new THREE.Box3().setFromObject(appendix.appendix)

      // const helper = new THREE.Box3Helper(box3)

      // f.addToScene(helper)
    }
  }

  function tick() {
    for (const tag of vertexTagsRef.value) {
      tag.lookAt(camera.position)
    }

    //Update controls
    controls.update()

    // Render
    renderer.render(f.scene, camera)

    window.requestAnimationFrame(tick)
  }
  tick()
  // Add an event listener to the renderer's domElement
  // renderer.domElement.addEventListener('mousedown', (event) => {
  //   let startX, startY
  //   if (!event.shiftKey) {
  //     // Prevent camera rotation by disabling controls when SHIFT is held
  //     controls.enabled = false

  //     // Track initial mouse position
  //     startX = event.clientX
  //     startY = event.clientY

  //     // Function to handle mousemove event
  //     const onMouseMove = (e) => {
  //       // Calculate the change in mouse position
  //       const deltaX = e.clientX - startX
  //       const deltaY = e.clientY - startY

  //       // Adjust the camera position based on deltaX and deltaY
  //       camera.position.x -= deltaX * 0.05 // Adjust the factor as needed
  //       camera.position.y += deltaY * 0.05 // Adjust the factor as needed

  //       // Update the controls target to keep it centered
  //       controls.target.x -= deltaX * 0.05
  //       controls.target.y += deltaY * 0.05

  //       // Update the initial mouse position for the next move event
  //       startX = e.clientX
  //       startY = e.clientY

  //       // Render the scene
  //       renderer.render(f.scene, camera)
  //     }

  //     // Function to handle mouseup event
  //     const onMouseUp = () => {
  //       // Remove the mousemove and mouseup listeners
  //       document.removeEventListener('mousemove', onMouseMove)
  //       document.removeEventListener('mouseup', onMouseUp)

  //       // Re-enable controls
  //       controls.enabled = true
  //     }

  //     // Add mousemove and mouseup listeners
  //     document.addEventListener('mousemove', onMouseMove)
  //     document.addEventListener('mouseup', onMouseUp)
  //   }
  // })
  // watchEffect(() => {
  //   if(changeWidth.value) {
  //     productMesh[7].children[0].morphTargetInfluences[0] = changeWidth.value
  //     productMesh[7].children[1].morphTargetInfluences[0] = changeWidth.value
  //   }
  //   if(changeHeight.value) {
  //     productMesh[7].children[0].morphTargetInfluences[1] = changeHeight.value
  //     productMesh[7].children[1].morphTargetInfluences[1] = changeHeight.value
  //   }
  // })
  // Function to create the line geometry and add it to the scene

  // Watch for changes in points.length and recreate the line when it changes

  watchEffect(() => {
    if (points.length) {
      console.log('RERENDER')
      // Create a geometry with the points
      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      // Create the line segments
      const line = new THREE.Line(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }))

      f.scene.add(line)

      // tick()
    }
  })
})
</script>
