import * as THREE from 'three'

export const points = [
    new THREE.Vector3(-1, 1, 0), //V3
    new THREE.Vector3(1, 1, 0), //V0
    new THREE.Vector3(1, -1, 0), //V1
    new THREE.Vector3(-1, -1, 0), //V2
    new THREE.Vector3(-1, 1, 0), // Close the rectangle by connecting back to the starting point
  ];

export function getMaxPoints(direction: string) {
  const maxRight = {
    point1: new THREE.Vector3(),
    point2: new THREE.Vector3()
  }
  const maxTop = {
    point1: new THREE.Vector3(),
    point2: new THREE.Vector3()
  }
  
  for (const point of points) {
    if(direction === "Add Up") {
      
      //Getting the left far point
      maxTop.point1.y = Math.max(maxTop.point1.y, point.y)
      maxTop.point1.x = Math.min(maxTop.point1.x, point.x)

      //Getting the right far point
      if(point.y === maxTop.point1.y) {
        maxTop.point2.y = point.y
        maxTop.point2.x = Math.max(maxTop.point2.x, point.x)
      }
      
    }
    if(direction === "Add Right") {
      //Getting the left far point
      maxRight.point1.y = Math.max(maxRight.point1.y, point.y)
      maxRight.point1.x = Math.max(maxRight.point1.x, point.x)

      //Getting the right far point
      if(point.x === maxRight.point1.x) {
        maxRight.point2.x = point.x
        maxRight.point2.y = Math.min(maxRight.point2.y, point.y)
      }
    }
  }

  return {
    maxTop,
    maxRight
  }
}