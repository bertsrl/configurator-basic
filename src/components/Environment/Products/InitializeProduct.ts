import * as THREE from 'three'

import { loadData } from './LoadData'

export const boundingBoxes = <THREE.Object3D[]>[]
export const fillMeshes = <THREE.Object3D[]>[]
export const limitPoints = <THREE.Object3D[]>[]

export async function computeRehauGroup() {

  console.log("Am fost invocat", boundingBoxes, fillMeshes, limitPoints)
  // ---------------- Rehau Group Start
  const product = await loadData('./models/Dora/profile_extended_new_center.glb')
  console.log(product)

  const box3 = new THREE.Box3().setFromObject(product[0])

  const dimension = new THREE.Vector3()
  box3.getSize(dimension)

  console.log("dimension: ", dimension)

  const boundingIntesect = new THREE.Mesh(
      new THREE.BoxGeometry(dimension.x, dimension.y, dimension.z),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
  )

  boundingIntesect.name = "boundingBox";
  // Calculate the middle point of the bounding box
  const middlePoint = new THREE.Vector3();
  box3.getCenter(middlePoint);

  boundingIntesect.position.set(
    middlePoint.x, 
    middlePoint.y,
    middlePoint.z
    )

  product[0].add(boundingIntesect)

  // Calculate the end point of the bounding box along the Y-axis
  const endZ = middlePoint.z + dimension.z / 6
  const endY = middlePoint.y + dimension.y / 6.05
  const startY = middlePoint.y - dimension.y / 6
  const startZ = middlePoint.z - dimension.z / 6
  
  console.log("rehau group z size: ", endZ - startZ)
  
  // Create a red point light at the middle point
  const sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
  const pointLight = new THREE.PointLight( 0x80ff80, 0.1 );
  pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
  pointLight.position.copy(middlePoint)

  const z_end_pointLight = new THREE.PointLight( 0xff0000, .1 );
  z_end_pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) );
  z_end_pointLight.position.set(middlePoint.x, middlePoint.y, endZ)

  const y_end_pointLight = new THREE.PointLight( 0xff0000, .1 );
  y_end_pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) );
  y_end_pointLight.position.set(middlePoint.x, endY, middlePoint.z)

  const z_start_pointLight = new THREE.PointLight( 0xffff00, .1 );
  z_start_pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffff00 } ) ) );
  z_start_pointLight.position.set(middlePoint.x, middlePoint.y, startZ)

  const y_start_pointLight = new THREE.PointLight( 0xffff00, .1 );
  y_start_pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffff00 } ) ) );
  y_start_pointLight.position.set(middlePoint.x, startY, middlePoint.z)

  const rehau_group = new THREE.Group();

  rehau_group.add(product[0], boundingIntesect)

  return {group: rehau_group, middlePoint, startZ, endZ, startY, endY};
  
  // ---------------- Rehau Group Start
}

export async function computeProduct() {
    const product_group = new THREE.Group()
    const {...rehau_group} = await computeRehauGroup()
    product_group.add(rehau_group.group)
    gatherHelpers(rehau_group.group)

    //Get the Rehau Group here
    for (let i=0; i<3; i++) {
        const {...rehau_group} = await computeRehauGroup()
        switch (i) {
            case 0: {
                const mirrored_rehau = cloneAndMirrorX(rehau_group.group);
                mirrored_rehau.position.set(rehau_group.middlePoint.x, 0, 2 * rehau_group.endZ)
                product_group.add(mirrored_rehau)
                gatherHelpers(mirrored_rehau)
                break;
            }
            case 1: {
                const mirrored_rehau = cloneAndMirrorY(rehau_group.group);
                mirrored_rehau.position.set(rehau_group.middlePoint.x, 2 * rehau_group.endY, 0)
                product_group.add(mirrored_rehau)
                gatherHelpers(mirrored_rehau)
                break;
            }
            case 2: {
                const mirrored_rehau = cloneAndMirrorY(cloneAndMirrorX(rehau_group.group));
                mirrored_rehau.position.set(rehau_group.middlePoint.x, 2 * rehau_group.endY, 2 * rehau_group.endZ)
                product_group.add(mirrored_rehau)
                gatherHelpers(mirrored_rehau)
                break;
            }
        }
    }

    return product_group
}

// Create a function to clone and mirror the mesh
function cloneAndMirrorX(mesh: THREE.Group) {
    const clonedMesh: THREE.Group = mesh.clone();
    clonedMesh.scale.setZ(-1); // Mirror along the Y-axis
    return clonedMesh;
}

// Create a function to clone and mirror the mesh
function cloneAndMirrorY(mesh: THREE.Group) {
    const clonedMesh = mesh.clone();
    clonedMesh.scale.setY(-1); // Mirror along the Y-axis
    return clonedMesh;
}

type Rehau = {
    pointLight: THREE.Object3D;
    z_end_pointLight: THREE.Object3D;
    z_start_pointLight: THREE.Object3D;
    y_end_pointLight: THREE.Object3D;
    y_start_pointLight: THREE.Object3D;
    boundingIntesect: THREE.Object3D;
}

function gatherHelpers(group: THREE.Group) {
    console.log(group)
    for(const child of group.children) {
        if(child instanceof THREE.Object3D) {
            if (child.name === "Rehau") fillMeshes.push(child)
            else if(child.name === "boundingBox") boundingBoxes.push(child)
            else limitPoints.push(child)
        }
    }
}