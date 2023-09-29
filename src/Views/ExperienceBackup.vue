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
          <size-control title="Depth" v-model:size="initialDepth" />
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
import provideVertexTag from '@/components/Environment/vertexTag'
import { loadData } from '@/components/Environment/Products/LoadData'
import SizeControl from '@/components/Controls/SizeControl.vue'
import ColorControl from '@/components/Controls/ColorControl.vue'
import { points } from '@/components/Environment/points'

import * as settings from '@/components/Environment/Settings/index'

import TWEEN from '@tweenjs/tween.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { biBoundingBox } from '@quasar/extras/bootstrap-icons'

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

const initialWidth = ref(0)
const initialHeight = ref(0)
const initialDepth = ref(0)

const initialCorner1Position = ref({ x: 0, y: 0, z: 0 })
const initialCorner2Position = ref({ x: 0, y: 0, z: 0 })
const initialCorner3Position = ref({ x: 0, y: 0, z: 0 })
const initialCorner4Position = ref({ x: 0, y: 0, z: 0 })

const boundingBoxesRef = ref()
const fillMeshesRef = ref()
const vertexTagsRef = ref()

/**
 * Base
 */
THREE.ColorManagement.enabled = false
THREE.Cache.enabled = true

// Debug
const gui = new dat.GUI()

onMounted(async () => {
  const product = await loadData('./models/new_tests/pivot_point.gltf')
  const productMesh = product.filter((a) => a && a.name)

  productMesh[0].position.y += 1.5
  productMesh[0].position.z -= 1.5
  productMesh[0].position.x += 5
  productMesh[0].rotation.y = Math.PI / 2

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
  const camera = new THREE.PerspectiveCamera(35, f.sizes.width / f.sizes.height, 0.1, 100)
  // const aspectRatio = sizes.width / sizes.height
  // const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

  camera.position.set(-1, 1, -1)
  f.addToScene(camera)

  f.resize(renderer, camera, f.sizes, parentElement)
  f.cursor(f.sizes)

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap

  f.addToScene(settings.ambientLight)
  f.addToScene(settings.light)

  f.addToScene(settings.plane)
  // //Create a sphere that cast shadows (but does not receive them)
  // const sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
  // const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
  // const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  // sphere.position.y = 0.05
  // sphere.castShadow = true; //default is false
  // sphere.receiveShadow = false; //default
  // scene.add( sphere );

  // f.addToScene(settings.plane)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.maxPolarAngle = 1.45

  f.addToScene(productMesh[0])

  // scene.add( new THREE.BoxHelper( productMesh[7] ) );

  // productMesh[0].children[0].material.wireframe = true;

  // productMesh[0].children[1].material.wireframe = true;

  // Define the four corners of the rectangular shape

  const vertexTags: THREE.Group[] = []
  for (const [index = 1, point] of points.slice(1).entries()) {
    const vertexTag = provideVertexTag(index)
    vertexTag.position.copy(point)
    vertexTag.scale.set(0.5, 0.5, 0.5)

    vertexTags.push(vertexTag)
    f.scene.add(vertexTag)
  }

  vertexTagsRef.value = vertexTags

  // Create a geometry with the points
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // Create the line segments
  const line = new THREE.Line(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }))

  f.scene.add(line)

  // for(const boundingBox of boundingBoxes) {

  //   scene.add(boundingBox)
  // }

  // for(const fillMesh of fillMeshes) {
  //   scene.add(fillMesh)
  // }

  const { boundingBoxes, fillMeshes } = f.computeBoundingBoxes(productMesh[0])

  boundingBoxesRef.value = toRaw(boundingBoxes)
  fillMeshesRef.value = toRaw(fillMeshes)

  f.addToScene(boundingBoxes)
  f.addToScene(fillMeshes)
  // // Loop through all the meshes in the GLTF model and set them to wireframe mode
  // productMesh[0].traverse((child: THREE.Object3D) => {
  //   if (child instanceof THREE.Mesh) {
  //     setMeshToWireframe(child);
  //   }
  // });
  // const profil_w = toRaw(productMesh[0])
  // const corner_a = toRaw(productMesh[0])
  // const corner_b = toRaw(productMesh[0])
  // const glass = toRaw(productMesh[0])

  // scene.add(profil_h, profil_w, corner_a, corner_b, glass)

  // profil_h.material.color = new THREE.Color("Red");
  // profil_w.material.color = new THREE.Color("Green");
  // corner_a.material.color = new THREE.Color("Blue");
  // corner_b.material.color = new THREE.Color("Yellow");
  // glass.material.color = new THREE.Color("Pink")
  // // productMesh[0].children[0].material.morphTarget = true
  // console.log(toRaw(productMesh[0]))

  // const material = new THREE.LineBasicMaterial({
  //   color: 0x0000ff
  // });

  // const points = [];
  // points.push( new THREE.Vector3( - 10, 0, 0 ) );
  // points.push( new THREE.Vector3( 0, 10, 0 ) );
  // points.push( new THREE.Vector3( 10, 0, 0 ) );

  // const geometry = new THREE.BufferGeometry().setFromPoints( points );

  // const line = new THREE.Line( geometry, material );
  // scene.add( line );

  // const lineStart = new THREE.Vector3( - 10, 0, 0 ); // Starting point
  // const lineEnd = new THREE.Vector3(0, 10, 0); // Ending point
  // const lineDirection = new THREE.Vector3().copy(lineEnd).sub(lineStart).normalize(); // Get line direction
  // const numberOfInstances = 10; // Number of instances you want to create

  // console.log(lineDirection)
  // const positions = [];
  // for (let i = 0; i < numberOfInstances; i++) {
  //   const t = i / (numberOfInstances - 1); // Parameterized value from 0 to 1
  //   const position = new THREE.Vector3().lerpVectors(lineStart, lineEnd, t);
  //   positions.push(position);
  // }
  // const materials = [
  //   new THREE.MeshBasicMaterial({ color: 0xff0000 }),   // Red material
  //   new THREE.MeshBasicMaterial({ color: 0x00ff00 }),   // Green material
  //   new THREE.MeshBasicMaterial({ color: 0x0000ff }),   // Blue material
  //   // Add more materials as needed
  // ];

  // for (const position of positions) {
  //   const instance = profil_h.clone(); // Clone your mesh
  //   instance.position.copy(position); // Set the position

  //   // Calculate the rotation quaternion to align with the line direction
  //   // instance.lookAt(lineDirection.z, lineDirection.z, lineDirection.z);
  //   const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
  //   instance.rotation.y = -Math.PI / 4
  //   instance.material = randomMaterial;
  //   scene.add(instance); // Add the instance to the scene
  // }
  // const leftRightSide = toRaw(productMesh[5].children[0])
  // const topBottomSide = toRaw(productMesh[5].children[1])
  // const glass = toRaw(productMesh[5].children[2])

  // const corner0 = toRaw(productMesh[6].children[0])
  // const corner1 = toRaw(productMesh[6].children[1])
  // const corner2 = toRaw(productMesh[6].children[2])
  // const corner3 = toRaw(productMesh[6].children[3])

  // console.log("ceva:", toRaw(topBottomSide.value))
  // console.log("corner1: ", corner1)

  // const corners = productMesh[6].children.map((corner: THREE.Object3D) => toRaw(corner))
  // corners[0].material.color = new THREE.Color("Red")
  // corners[1].material.color = new THREE.Color("Green")
  // corners[2].material.color = new THREE.Color("Blue")
  // corners[3].material.color = new THREE.Color("Yellow")

  // initialCorner1Position.value.z = corners[0].position.z
  // initialCorner2Position.value.z = corners[1].position.z
  // initialCorner3Position.value.z = corners[2].position.z
  // initialCorner4Position.value.z = corners[3].position.z

  // const movingGroup = new THREE.Group();
  // const initialTopBottomSize = topBottomSide.scale.z;

  // console.log("rawCorners: ", corners)
  // const topBottomGroup = new THREE.Group()
  // topBottomGroup.add(topBottomSide, corners[0], corners[1], corners[2], corners[3])

  // const leftRightGroup = new THREE.Group()
  // leftRightGroup.add(leftRightSide, corners[0], corners[1], corners[2], corners[3])

  // console.log("Grupul: ", topBottomGroup)
  // const initialGroupSize = topBottomGroup.scale.z;

  // scene.add(leftRightSide, topBottomSide, glass, ...corners, movingGroup)

  productMesh.forEach((element) => {
    // console.log(element)
    // topBottomSide.value = element.children[1];
    // //   element.children.forEach((child: THREE.Object3D) => {
    // //     if(child instanceof THREE.Mesh) {
    // //       topBottomSide.value = child;
    // //       Product
    // //       topBottomSide.value.position.set(0,0,0);
    // //       topBottomSide.value.position.set(1,1,1);
    // //     }
    // //   if(child instanceof THREE.Mesh) {
    // //     const vnh = new VertexNormalsHelper( child, 1 );
    // // 		scene.add( vnh );
    // //     const testControls = {
    // //       zPosition: child.position.z,
    // //     };
    // //     // Add the control to the GUI
    // //     // gui.add(testControls, 'zPosition', -initialWidth.value, initialWidth.value).onChange((value) => {
    // //     //   // Update the z-position of the child object when the GUI slider is changed
    // //     //   child.position.z = value;
    // //     // });
    // //       if(child.name === "Frame_Top_Bottom") {
    // //         topBottomSide.value = child
    // //         topBottomSide.value.scale.set(.5,.5,.5);
    // //         // child.material.color = new THREE.Color( hex.value );
    // //         // child.castShadow = true;
    // //         // topBottomGroup.add(child)
    // //       }
    // //       if(child.name === "Frame_Left_Right") {
    // //         initialHeight.value = child.scale.y;
    // //         // child.material.color = new THREE.Color( hex.value );
    // //         // child.castShadow = true;
    // //       }
    // //       if(child.name === "Glass") {
    // //         initialHeight.value = child.scale.y;
    // //         initialWidth.value = child.scale.z;
    // //       }
    // //       if(child.name === "Corner1") {
    // //         child.material.color = new THREE.Color( "Red" );
    // //         // child.position.z += 0.1
    // //         initialCorner1Position.value = child.position
    // //         // child.position.z += 0.1
    // //       }
    // //       else if(child.name === "Corner2") {
    // //         child.material.color = new THREE.Color( "Green" );
    // //         // child.position.z += 0.1
    // //         initialCorner2Position.value = child.position
    // //       }
    // //       else if(child.name === "Corner3") {
    // //         child.material.color = new THREE.Color( "Blue" );
    // //         // child.position.z -= 0.1
    // //         initialCorner3Position.value = child.position
    // //       }
    // //       else if(child.name === "Corner4") {
    // //         child.material.color = new THREE.Color( "Yellow" );
    // //         // child.position.z -= 0.1
    // //         initialCorner4Position.value = child.position
    // //       }
    // //   }
    // // });
  })

  function tick() {
    for (const tag of vertexTags) {
      tag.lookAt(camera.position)
    }
    //     topBottomGroup.scale.z = (initialGroupSize+changeWidth.value)
    // corner1.position.set(initialCorner1Position)
    //Update product customization
    // productMesh.forEach(element => {
    //   // element.scale.set(initialDepth.value, initialHeight.value*100, initialWidth.value*100)
    //   element.children.forEach((child: THREE.Object3D) => {
    //     if(child instanceof THREE.Mesh) {
    //       if(child.name === "Frame_Top_Bottom") {
    //         // child.scale.z = (initialWidth.value + changeWidth.value);
    //         // child.material.color = new THREE.Color( hex.value );
    //         // child.castShadow = true;
    //       }
    //       if(child.name === "Frame_Left_Right") {
    //         // child.scale.y = (initialHeight.value + changeHeight.value);
    //         // child.material.color = new THREE.Color( hex.value );
    //         // child.castShadow = true;
    //       }
    //       if(child.name === "Glass") {
    //         // child.scale.y = (initialHeight.value + changeHeight.value);
    //         // child.scale.z = (initialWidth.value + changeWidth.value);
    //       }
    //     }
    //   });
    // });

    // settings.plane.receiveShadow = true
    // Update controls
    controls.update()

    // Update the Tween manager
    TWEEN.update()

    // Render
    renderer.render(f.scene, camera)

    window.requestAnimationFrame(tick)
  }

  tick()

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
})
</script>
