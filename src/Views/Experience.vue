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
        <VertexTag :scene="scene" /> 
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
            <size-control title="Width" v-model:size="changeWidth"/>
            <size-control title="Height" v-model:size="changeHeight"/>
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

import { ref, toRaw, watch, watchEffect } from 'vue'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { resize, cursor } from '../components/Environment/functions'
import provideVertexTag from '../components/Environment/vertexTag'
import { loadData } from '../components/Environment/Products/LoadData'
import SizeControl from '../components/Controls/SizeControl.vue'
import ColorControl from '../components/Controls/ColorControl.vue' 

import TWEEN from '@tweenjs/tween.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { biBoundingBox } from '@quasar/extras/bootstrap-icons';

const hex = ref('green');
const colorOptions = ref([
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' }
])

const changeWidth = ref(0);
const changeHeight = ref(0);

const initialWidth = ref(0);
const initialHeight = ref(0);
const initialDepth = ref(0);

const initialCorner1Position = ref({x:0, y:0, z:0});
const initialCorner2Position = ref({x:0, y:0, z:0});
const initialCorner3Position = ref({x:0, y:0, z:0});
const initialCorner4Position = ref({x:0, y:0, z:0});

/**
 * Base
 */
THREE.ColorManagement.enabled = false
THREE.Cache.enabled = true;

// Debug
const gui = new dat.GUI()

onMounted(async () => {
  const productMesh = await loadData('./models/new_tests/pivot_point.gltf')
  productMesh[5].position.y += 1.5;
  productMesh[5].position.z -= 1.5;
  productMesh[5].position.x += 5;
  productMesh[5].rotation.y = Math.PI / 2;

  console.log(productMesh)

  // Canvas
  const canvas = document.getElementById('canvas')!
  console.log(canvas)

  // Scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xdedede)
  // scene.fog = new THREE.Fog(0xdedede, 1, 5)
  
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
  const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x000000 } )
  const plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.position.y = -1.2
  plane.rotation.x = - Math.PI / 2;
    
  plane.receiveShadow = true;
  scene.add( plane );
  
  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.maxPolarAngle = 1.45

  scene.add(...productMesh)

  // scene.add( new THREE.BoxHelper( productMesh[7] ) );


  // productMesh[7].children[0].material.wireframe = true;

  // productMesh[7].children[1].material.wireframe = true;

  // Define the four corners of the rectangular shape


 /**
  * @abstract adding the helping lines of the skeleton build and vertices tags indexed
  */
 
  const points = [
    new THREE.Vector3(-1, 1, 1),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(-1, 1, 1), // Close the rectangle by connecting back to the starting point
    new THREE.Vector3(-2, 1, 1),
    new THREE.Vector3(-3, 4, 2),
    new THREE.Vector3(-6, 2, 5),
    new THREE.Vector3(3, 3, 3),
    new THREE.Vector3(0, 5, 8)
  ];

  const vertexTags: THREE.Group[] = []
  for(const [index=1, point] of points.slice(1).entries()) {
    const vertexTag = provideVertexTag(index)
    vertexTag.position.copy(point)
    vertexTag.scale.set(0.5, 0.5, 0.5)
    
    vertexTags.push(vertexTag);
    scene.add(vertexTag)
  }

    // Create a geometry with the points
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // Create the line segments
  const line = new THREE.Line(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }));

  scene.add(line)


   /**
  * @abstract Create bounding boxes for each line segment
  */
  const boundingBoxes = [];

  for (let i = 0; i < points.length - 1; i++) {
    // Define the endpoints of the line segment
    const start = points[i];
    const end = points[i + 1];

    // Calculate the length and direction of the line segment
  const lineLength = start.distanceTo(end);

  // Create a box geometry for the bounding box
  const boxGeometry = new THREE.BoxGeometry(0.2, 0.2, lineLength);

  // Create a mesh for the bounding box
  const boundingBoxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));

  // Position the bounding box at the center of the line segment
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5); // MEDIA ARITMETICA DINTRE NUMERE
  boundingBoxMesh.position.copy(midpoint);

  // Create a texture and set its repeat values
  const texture = new THREE.TextureLoader().load('./textures/Wood_023_roughness.jpg');
  texture.wrapS = THREE.RepeatWrapping; // Repeat horizontally
  texture.wrapT = THREE.RepeatWrapping; // Repeat vertically
  texture.repeat.set(10, 10); // Number of times to repeat in each direction (adjust as needed)

  /**
   * @constant fill-up the bounding boxes
   */

  const fill = productMesh[5].clone()
  fill.position.copy(start)
  fill.scale.set(0.1, 0.1, lineLength/2)
  fill.lookAt(end) 
  fill.material.map = texture;
  fill.material.transparent = true;
  fill.material.opacity = 0.1;

  scene.add(fill)
  // Rotate the bounding box to align with the line's direction
  boundingBoxMesh.lookAt(end);

  boundingBoxes.push(boundingBoxMesh);

  // Add the bounding box mesh to your scene
  scene.add(boundingBoxMesh);
  }

// // Loop through all the meshes in the GLTF model and set them to wireframe mode
// productMesh[7].traverse((child: THREE.Object3D) => {
//   if (child instanceof THREE.Mesh) {
//     setMeshToWireframe(child);
//   }
// });
  // const profil_w = toRaw(productMesh[5])
  // const corner_a = toRaw(productMesh[6])
  // const corner_b = toRaw(productMesh[7])
  // const glass = toRaw(productMesh[9])
  
  // scene.add(profil_h, profil_w, corner_a, corner_b, glass)

  // profil_h.material.color = new THREE.Color("Red");
  // profil_w.material.color = new THREE.Color("Green");
  // corner_a.material.color = new THREE.Color("Blue");
  // corner_b.material.color = new THREE.Color("Yellow");
  // glass.material.color = new THREE.Color("Pink")
  // // productMesh[7].children[0].material.morphTarget = true
  // console.log(toRaw(productMesh[7]))

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

  productMesh.forEach(element => {
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
    });

  function tick()
  {
      for(const tag of vertexTags) {
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

      plane.receiveShadow = true;
      // Update controls
      controls.update()

       // Update the Tween manager
      TWEEN.update();

      // Render
      renderer.render(scene, camera)

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
});
</script>