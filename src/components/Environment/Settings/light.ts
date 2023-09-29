import * as THREE from 'three'

//Lights
export const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)

//Create a PointLight and turn on shadows for the light
export const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 1, -0.5)
light.castShadow = true // default false

//Set up shadow properties for the light
light.shadow.mapSize.width = 512 // default
light.shadow.mapSize.height = 512 // default
light.shadow.camera.near = 0.5 // default
light.shadow.camera.far = 500 // default