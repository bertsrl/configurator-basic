import * as THREE from 'three'

import { addToScene } from '../functions'
import { onMounted } from 'vue'

//Create a plane that receives shadows (but does not cast them)
const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xc4c4c4 })
export const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.y = -3.2
plane.rotation.x = -Math.PI / 2

plane.receiveShadow = true
