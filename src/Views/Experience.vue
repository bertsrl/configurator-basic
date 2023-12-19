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
    color: #000;
    width: 100vw;
  }

  .navigation {
    grid-area: navigation;
    width: 100%;
  }

  #content {
    // grid-area: content;
    // display: grid;
    // grid-template-columns: 70% 30%;
    // grid-template-areas: 'canvas settings';
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
  <div class="container" ref="main">
    <!-- <q-btn style="position: absolute; top: 10vh; left: 10vw" @click="switchToMainPanel()"
      >Test Transition</q-btn
    > -->
    <configure-panel
      :config-panel-id="store.currentConfigPanelId.value"
      class="card-transition configure-panel"
    />
    <!-- <q-card
      class="q-pa-md rounded-borders card-transition"
      style="width: 32vw; position: absolute; top: 10vh; right: -40%; z-index: 999"
      flat
      bordered
    >
      <q-card-section>
        <div class="text-h6">Test Transition</div>
        <div class="text-subtitle2">Test Transition</div>
      </q-card-section>
    </q-card> -->
    <div
      class="q-pa-md rounded-borders card-transition main-panel"
      style="width: 35vw; position: absolute; top: 10vh; right: 5vw"
    >
      <q-card class="my-card" id="control-card" flat bordered>
        <q-card-section>
          <div class="settings-container q-pa-md">
            <h6 v-if="!store.isProfileLook.value">Customize Product</h6>
            <h6 v-else>
              Detail drawings of windows and balcony doors Frame 86 GENEO® with sash Z57 GENEO® or
              sash A57 GENEO®
            </h6>
          </div>
        </q-card-section>

        <q-card-section v-if="!store.isProfileLook.value">
          <q-tabs v-model="tab" class="text-teal">
            <q-tab label="Size Controls" name="one" />
            <q-tab label="Texture" name="two" />
          </q-tabs>

          <q-separator />

          <q-tab-panels
            v-model="tab"
            :style="{
              height: $q.screen.width >= 1200 ? '65vh' : $q.screen.width >= 600 ? '40vh' : 'auto'
            }"
          >
            <q-tab-panel name="one">
              <div style="width: 100%">
                <div>
                  <div class="size-controls q-pa-md row">
                    <div class="controls-iter fit">
                      <div class="text-h6 col-6">Size Controls</div>
                      <div class="q-py-md text-h6">Width</div>
                      <q-btn
                        @click="
                          () => {
                            store.switchToMainPanel()
                            store.currentConfigPanelId.value = 0
                            store.configurePanelOpen.value = true
                          }
                        "
                      >
                        Configure Limits
                      </q-btn>
                      <slider-component v-model:size-prop="changeWidth" :control-id="0" />

                      <div class="q-py-md text-h6">Height</div>
                      <q-btn
                        @click="
                          () => {
                            store.switchToMainPanel()
                            store.currentConfigPanelId.value = 1
                            store.configurePanelOpen.value = true
                          }
                        "
                      >
                        Configure Limits
                      </q-btn>
                      <slider-component v-model:size-prop="changeHeight" :control-id="1" />
                    </div>
                    <!-- 
                  <size-control
                    title="Width"
                    class="col-12"
                    type="width"
                    v-model:size="changeWidth"
                  />
                  <size-control
                    title="Height"
                    class="col-12"
                    type="height"
                    v-model:size="changeHeight"
                  /> -->
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="two">
              <div class="color-controls q-pa-md">
                <color-control :options="colorOptions" v-model:color_value="hex" />
                <!-- <p style="margin-top: 2vh">Selected color: {{ hex }}</p> -->
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <product-details v-else />
      </q-card>
    </div>
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
      <!-- <helpers-control /> -->
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
      <!-- <div class="settings" style="background-color: $secondary">
        <q-scroll-area style="height: 750px; width: 100%">
          <div v-if="!store.isProfileLook.value">
            <div class="settings-container q-pa-md">
              <h6>Customize Product</h6>
            </div>
            <div class="color-controls q-pa-md">
              <h6>Color Controls</h6>
              <color-control :options="colorOptions" v-model:color_value="hex" />
              <p style="margin-top: 2vh">Selected color: {{ hex }}</p>
            </div>
            <div class="size-controls q-pa-md">
              <h6>Size Controls</h6>

              <size-control title="Width" class="col-12" type="width" v-model:size="changeWidth" />
              <size-control
                title="Height"
                class="col-12"
                type="height"
                v-model:size="changeHeight"
              />
            </div>
          </div>
          <div v-else class="settings"><h6>No available options in Profile View</h6></div>
        </q-scroll-area>
        <div id="license" style="color: #000; font-size: 1vw: ">Powered by @bert.tech</div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUpdate } from 'vue'
import * as THREE from 'three'
import * as dat from 'lil-gui'

import { ref, reactive, toRaw, watch, watchEffect, computed } from 'vue'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as f from '@/components/Environment/functions'
import * as vTag from '@/components/Environment/vertexTag'
import * as settings from '@/components/Environment/Settings/'
import { loadData } from '@/components/Environment/Products/LoadData'
import SizeControl from '@/components/Controls/SizeControl/SizeInputs.vue'
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
import ConfigurePanel from './ConfigurePanel.vue'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

import SizeInputs from '@/components/Controls/SizeControl/SizeInputs.vue'
import SliderComponent from '@/components/Controls/SizeControl/SliderComponent.vue'
import anime from 'animejs/lib/anime.es.js'
import ProductDetails from './ProductDetails.vue'

const minSize = ref(0)
const maxSize = ref(30)
const minW = ref(0)
const maxW = ref(20)
const mappedValue1030 = ref()
const mappedValue01 = ref()

const isMainPanel = ref(true)

const hex = ref('')
const colorOptions = ref([
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' }
])

const windowInitialTexture = ref<THREE.Texture[]>([])

const changeWidth = ref(0)
const changeHeight = ref(0)
const morphMeshesRef = ref()
const mappedBoxScaleRef = ref()
const glassRef = reactive({
  mesh: ref(),
  initalSize: ref()
})

const rendererRef = ref()
const controlsRef = ref()

const q = useQuasar()

const myPoints = ref()
myPoints.value = points

const tab = ref('one')

// Debug
// const gui = new dat.GUI()

// Variables for mouse drag
let isDragging = false
let isOnScene = true
let previousMousePosition = {
  x: 0,
  y: 0
}

// // Function to handle mouse down event
// function onMouseDown(event) {
//   isDragging = true
//   previousMousePosition = {
//     x: event.clientX,
//     y: event.clientY
//   }
// }

// // Function to handle mouse move event
// function onMouseMove(event) {
//   if (!isDragging) return

//   const deltaMove = {
//     x: event.clientX - previousMousePosition.x,
//     y: event.clientY - previousMousePosition.y
//   }

//   // Rotate the cube based on mouse movement
//   store.windowRef.value.rotation.y += deltaMove.x * 0.01
//   store.windowRef.value.rotation.x += deltaMove.y * 0.01

//   previousMousePosition = {
//     x: event.clientX,
//     y: event.clientY
//   }
// }

// Function to handle mouse up event
function onMouseUp() {
  isDragging = false
}

const limits = {
  minWindowZ: 0,
  maxWindowZ: 0,
  minWindowX: 0,
  maxWindowX: 0
}

// function onMouseWheel(event) {
//   if (isOnScene) {
//     // Assuming limits.min and limits.max are defined
//     const minWindowZ = limits.minWindowZ
//     const maxWindowZ = limits.maxWindowZ
//     const minWindowX = limits.minWindowX
//     const maxWindowX = limits.maxWindowX

//     store.windowRef.value.position.z += event.detail * 0.01

//     // Ensure the position.z stays within the limits
//     if (store.windowRef.value.position.z < minWindowZ) {
//       store.windowRef.value.position.z = minWindowZ
//     } else if (store.windowRef.value.position.z > maxWindowZ) {
//       store.windowRef.value.position.z = maxWindowZ
//     }

//     // Ensure the position.z stays within the limits
//     if (store.windowRef.value.position.x < minWindowX) {
//       store.windowRef.value.position.x = minWindowX
//     } else if (store.windowRef.value.position.z > maxWindowX) {
//       store.windowRef.value.position.x = maxWindowX
//     }
//     // Adjust position.x based on event.detail
//     store.windowRef.value.position.x += event.detail * 0.0001
//   }
// }

const main = ref()
import gsap from 'gsap'
import type { Control } from '@/types'
import { matRemoveShoppingCart } from '@quasar/extras/material-icons'

import { app } from '@/firebase'
import { getFirestore } from 'firebase/firestore'

import { createApp } from 'vue'

onMounted(async () => {
  // ctx = gsap.context((self) => {
  //   const cards = self.selector('.card-transition')
  //   console.log(cards)
  //   tl = gsap.timeline().to(cards[1], { xPercent: 150 }).to(cards[0], { xPercent: -200 }).reverse()
  // }, main.value) // <- Scope!

  // Add event listeners
  document.addEventListener('mouseup', onMouseUp, false)
  // document.addEventListener('mousewheel', onMouseWheel, false)
  // document.addEventListener('MozMousePixelScroll', onMouseWheel, false)

  const my_card = document.getElementById('control-card')

  my_card!.addEventListener(
    'mouseenter',
    () => {
      isOnScene = false
    },
    false
  )
  my_card!.addEventListener(
    'mouseleave',
    () => {
      isOnScene = true
    },
    false
  )

  store.isLoading.value = true

  const product_group = await computeProduct()
  product_group.scale.multiplyScalar(0.025)

  product_group.position.set(-1, -1, 0)
  product_group.rotation.y = Math.PI / 2

  f.scene.add(product_group)

  const morphMeshes = await f.unwrapChildren(product_group)
  morphMeshesRef.value = morphMeshes

  store.productLoaded.value = true

  console.log('morphMeshesRef.value: ', morphMeshesRef.value)

  const product = await loadData('./models/Dora/profile_extended_with_glass(2).glb')

  const glass = product[1]
  store.windowRef.value.add(toRaw(glass)) //TODO: De corectat chestia asta pentru ca provoaca probleme. Spre exemplu in ColorControl.vue trebuie sa adaug un if(... !== undefined)

  limits.maxWindowZ = store.windowRef.value.position.z + 2
  limits.minWindowZ = store.windowRef.value.position.z - 2
  limits.maxWindowX = store.windowRef.value.position.x + 0.01
  limits.minWindowX = store.windowRef.value.position.x - 0.01

  const box3 = new THREE.Box3().setFromObject(glass)

  const dimension = new THREE.Vector3()
  box3.getSize(dimension)

  glass.position.set(0, 0, 0)

  glass.scale.set(glass.scale.x, glass.scale.y * 2, glass.scale.z * 2)

  glassRef.mesh = glass
  glassRef.initalSize = new THREE.Vector3(glass.scale.x, glass.scale.y, glass.scale.z)

  console.log(toRaw(store.windowRef.value))

  // await store.getControlsFromDB()

  // console.log('AM REUSIT: ', store.controlsArray)

  const data = {
    scale: 0,
    boxScale: 1
  }

  for (const box of boundingBoxes) {
    box.scale.z = 1 / 3
    box.scale.y = 1 / 3
  }
  // Adding Loaded Mesh full version in the back as a dummy
  // f.addToScene(await f.addDummy())

  // Canvas
  const canvas = document.getElementById('canvas')!

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

  // // Controls
  const controls = new OrbitControls(f.camera, canvas)
  controls.enableDamping = true
  controls.enabled = false

  controls.minDistance = 10
  controls.maxDistance = 50

  // gui.add(controls, 'enabled').name('Orbit Controls')
  // Disable screen dragging if store.isDraggable is false

  controlsRef.value = controls

  console.log('Inainte de textMeshes: ', store.controlsArray)

  tick()
})

function tick() {
  //Update controls
  if (store.isDraggable.value) controlsRef.value.update()

  // Render
  rendererRef.value.render(f.scene, f.camera)

  if (store.isSphereLook.value) {
    store.textMeshes.windowHeightText.lookAt(f.camera.position)
    store.textMeshes.windowWidthText.lookAt(f.camera.position)
  }

  window.requestAnimationFrame(tick)
}

onBeforeUpdate(async () => {
  setTimeout(() => {
    // Loading completed, set isLoading to false
    store.isLoading.value = false
  }, 1000) // Simulating a 3-second loading time, adjust as needed
})

watch(store.windowChange, (newValue) => {
  if (newValue) {
    store.isLoading.value = true

    location.reload()

    setTimeout(() => {
      store.isLoading.value = false
    }, 1300)
  }
})

const widthChanging = ref(false)
const heightChanging = ref(false)

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useQuasar } from 'quasar'
import { toneMapping } from 'three/examples/jsm/nodes/Nodes.js'

watch(store.loggerText, (newVal, preVal) => {
  if (newVal) {
    toast.error(store.loggerText.value, {
      autoClose: 20000,
      position: toast.POSITION.BOTTOM_CENTER
    }) // ToastOptions
  }
})

watch(store.activeTexture, async (newVal) => {
  if (newVal.name !== 'Original') {
    for (const rehau_group of store.windowRef.value.children) {
      if (rehau_group instanceof THREE.Object3D) {
        const rehau_profile = toRaw(rehau_group.children[0])

        if (rehau_profile !== undefined)
          for (const rehau_component of rehau_profile.children) {
            if (
              rehau_component instanceof THREE.Object3D &&
              rehau_component.children[0] instanceof THREE.Mesh &&
              rehau_component.children[1] instanceof THREE.Mesh &&
              rehau_component.children[5] instanceof THREE.Mesh &&
              rehau_component.children[7] instanceof THREE.Mesh &&
              rehau_component.children[8] instanceof THREE.Mesh &&
              rehau_component.children[9] instanceof THREE.Mesh
            ) {
              windowInitialTexture.value.push(rehau_component.children[0].material.map)
              windowInitialTexture.value.push(rehau_component.children[1].material.map)
              windowInitialTexture.value.push(rehau_component.children[5].material.map)
              windowInitialTexture.value.push(rehau_component.children[7].material.map)
              windowInitialTexture.value.push(rehau_component.children[8].material.map)
              windowInitialTexture.value.push(rehau_component.children[9].material.map)
            }
          }
      }
    }

    const texture = new THREE.TextureLoader().load(newVal.imageUrl)
    texture.colorSpace = THREE.SRGBColorSpace

    changePlasticColor(texture)

    console.log('TEXTURA BA:', texture)
    console.log('windowRef: ', store.windowRef.value)
  } else {
    for (const rehau_group of store.windowRef.value.children) {
      if (rehau_group instanceof THREE.Object3D) {
        const rehau_profile = toRaw(rehau_group.children[0])

        if (rehau_profile !== undefined)
          for (const rehau_component of rehau_profile.children) {
            if (
              rehau_component instanceof THREE.Object3D &&
              rehau_component.children[0] instanceof THREE.Mesh &&
              rehau_component.children[1] instanceof THREE.Mesh &&
              rehau_component.children[5] instanceof THREE.Mesh &&
              rehau_component.children[7] instanceof THREE.Mesh &&
              rehau_component.children[8] instanceof THREE.Mesh &&
              rehau_component.children[9] instanceof THREE.Mesh
            ) {
              rehau_component.children[0].material.map = windowInitialTexture.value[0]
              rehau_component.children[1].material.map = windowInitialTexture.value[1]
              rehau_component.children[5].material.map = windowInitialTexture.value[2]
              rehau_component.children[7].material.map = windowInitialTexture.value[3]
              rehau_component.children[8].material.map = windowInitialTexture.value[4]
              rehau_component.children[9].material.map = windowInitialTexture.value[5]
            }
          }
      }
    }
  }
})

function changePlasticColor(texture: THREE.Texture) {
  for (const rehau_group of store.windowRef.value.children) {
    if (rehau_group instanceof THREE.Object3D) {
      const rehau_profile = toRaw(rehau_group.children[0])

      if (rehau_profile !== undefined)
        for (const rehau_component of rehau_profile.children) {
          if (
            rehau_component instanceof THREE.Object3D &&
            rehau_component.children[0] instanceof THREE.Mesh &&
            rehau_component.children[1] instanceof THREE.Mesh &&
            rehau_component.children[5] instanceof THREE.Mesh &&
            rehau_component.children[7] instanceof THREE.Mesh &&
            rehau_component.children[8] instanceof THREE.Mesh &&
            rehau_component.children[9] instanceof THREE.Mesh
          ) {
            rehau_component.children[0].material.map = texture
            rehau_component.children[1].material.map = texture
            rehau_component.children[5].material.map = texture
            rehau_component.children[7].material.map = texture
            rehau_component.children[8].material.map = texture
            rehau_component.children[9].material.map = texture
          }
        }
    }
  }
}

watch(store.isProfileLook, (newVal) => {
  if (newVal) {
    for (const mesh of morphMeshesRef.value) {
      if (mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[0] = 0
        mesh.morphTargetInfluences[1] = 0
      }
    }

    controlsRef.value.enabled = true

    gsap.to(f.camera.position, {
      x: -10,
      z: 4,
      y: 3
    })

    const worldProfileMiddle = new THREE.Vector3()
    if (store.windowRef.value.children[0] instanceof THREE.Object3D)
      store.windowRef.value.children[0].getWorldPosition(worldProfileMiddle)

    gsap.to(controlsRef.value.target, {
      x: worldProfileMiddle.x - 0.25,
      y: worldProfileMiddle.y - 1,
      z: worldProfileMiddle.z
    })

    f.camera.setViewOffset(q.screen.width, q.screen.height, 300, 2, q.screen.width, q.screen.height)

    glassRef.mesh.scale.copy(glassRef.initalSize)

    f.provideProfileView()
  } else {
    f.camera.setViewOffset(q.screen.width, q.screen.height, 0, 0, q.screen.width, q.screen.height)
    initWindowLook()
  }
})

watch(store.isSphereLook, (newVal) => {
  if (newVal === true) {
    controlsRef.value.enabled = true

    console.log('Sphere View!')
    gsap.to(store.windowRef.value.position, {
      x: 0
    })

    gsap.to(store.meters.x.position, {
      x: 0
    })
    gsap.to(store.meters.y.position, {
      x: store.windowRef.value.position.x + 4.2
    })

    gsap.to(store.textMeshes.windowWidthText.position, {
      x: 0
    })

    gsap.to(store.textMeshes.windowHeightText.position, {
      x: store.meters.y.position.x + 2.85
    })

    anime({
      targets: '.card-transition',
      translateX: [0, 800]
    })
  } else {
    controlsRef.value.enabled = false

    gsap.to(f.camera.position, {
      x: store.cameraFrontPosition.position.x,
      y: store.cameraFrontPosition.position.y,
      z: store.cameraFrontPosition.position.z,
      onUpdate: () => {
        store.textMeshes.windowHeightText.lookAt(f.camera.position)
        store.textMeshes.windowWidthText.lookAt(f.camera.position)
      },
      onComplete: () => {
        // f.camera.position.copy(store.cameraFrontPosition.position)
        store.windowRef.value.lookAt(f.camera.position)
        store.windowRef.value.rotation.y += Math.PI / 2 - 0.1
      }
    })

    gsap.to(store.meters.y.position, {
      x: store.cameraFrontPosition.position.x - 1.2
    })

    gsap.to(store.meters.x.position, {
      x: store.cameraFrontPosition.position.x - 2.7
    })

    gsap.to(store.textMeshes.windowWidthText.position, {
      x: store.cameraFrontPosition.position.x - 2.7
    })

    gsap.to(store.textMeshes.windowHeightText.position, {
      x: store.cameraFrontPosition.position.x - 1
    })

    anime({
      targets: '.card-transition',
      translateX: [800, 0]
    })

    gsap.to(store.windowRef.value.position, {
      x: -2.7
    })
  }
})

function initWindowLook() {
  // changeWidth.value = store.controlsArray.find((val) => val.name === 'Width')?.mappedValue01!
  // changeHeight.value = store.controlsArray.find((val) => val.name === 'Height')?.mappedValue01!

  gsap.to(f.camera.position, {
    x: store.cameraFrontPosition.position.x,
    y: store.cameraFrontPosition.position.y,
    z: store.cameraFrontPosition.position.z,
    onUpdate: () => {
      store.textMeshes.windowHeightText.lookAt(f.camera.position)
      store.textMeshes.windowWidthText.lookAt(f.camera.position)
    },
    onComplete: () => {
      // f.camera.position.copy(store.cameraFrontPosition.position)
      store.windowRef.value.lookAt(f.camera.position)
      store.windowRef.value.rotation.y += Math.PI / 2 - 0.1
    }
  })

  gsap.to(controlsRef.value.target, {
    x: 0,
    y: 0,
    z: 0
  })

  // Map data.scale to box scale between 1/3 and 1
  const minGlassSizeY = glassRef.initalSize.y
  const maxGlassSizeY = 10

  const mappedGlassScaleY = minGlassSizeY + changeWidth.value * (maxGlassSizeY - minGlassSizeY)

  glassRef.mesh.scale.y = mappedGlassScaleY

  // Map data.scale to box scale between 1/3 and 1
  const minGlassSizeZ = glassRef.initalSize.z
  const maxGlassSizeZ = 10

  const mappedGlassScaleZ = minGlassSizeZ + changeHeight.value * (maxGlassSizeZ - minGlassSizeZ)

  glassRef.mesh.scale.z = mappedGlassScaleZ

  for (const mesh of morphMeshesRef.value) {
    if (mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
      mesh.morphTargetInfluences[0] = changeWidth.value
    }
  }
  for (const mesh of morphMeshesRef.value) {
    if (mesh instanceof THREE.Mesh && mesh.morphTargetInfluences) {
      mesh.morphTargetInfluences[1] = changeHeight.value
    }
  }

  console.log(store.controlsArray)

  f.provideWindowView()
}

watch(store.isMetricsEnabled, (newVal) => {
  if (newVal) {
    store.textMeshes.windowHeightText.visible = true
    store.textMeshes.windowWidthText.visible = true
    store.meters.x.visible = true
    store.meters.y.visible = true
  } else {
    store.textMeshes.windowHeightText.visible = false
    store.textMeshes.windowWidthText.visible = false
    store.meters.x.visible = false
    store.meters.y.visible = false
  }
})

watch(changeWidth, (newVal, oldVal) => {
  console.log('BAAA Experience', changeWidth)
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

    store.meters.x.scale.x = mappedWidth
    store.meters.y.position.x = store.windowRef.value.position.x + mappedWidth * 1.5
    store.textMeshes.windowHeightText.position.x = store.meters.y.position.x + 0.1

    if (store.isMetricsEnabled.value)
      meter.createText(store.units.width).then((newTextMesh) => {
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

    const glassInitialSize = toRaw(glassRef.initalSize)

    // Map data.scale to box scale between 1/3 and 1
    const minGlassSize = glassInitialSize.y
    const maxGlassSize = 10

    const mappedGlassScale = minGlassSize + changeWidth.value * (maxGlassSize - minGlassSize)

    glassRef.mesh.scale.y = mappedGlassScale

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

    store.meters.y.scale.y = mappedHeight
    store.meters.x.position.y = store.windowRef.value.position.y + mappedHeight * 1.5
    store.textMeshes.windowWidthText.position.y = store.meters.x.position.y + 0.1

    if (store.isMetricsEnabled.value)
      meter.createText(store.units.height).then((newTextMesh) => {
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

    const glassInitialSize = toRaw(glassRef.initalSize)

    // Map data.scale to box scale between 1/3 and 1
    const minGlassSize = glassInitialSize.z
    const maxGlassSize = 10

    const mappedGlassScale = minGlassSize + changeHeight.value * (maxGlassSize - minGlassSize)

    glassRef.mesh.scale.z = mappedGlassScale

    heightChanging.value = false
  }
})
</script>
