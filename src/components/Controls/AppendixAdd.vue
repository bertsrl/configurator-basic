<template>
  <div>
    <q-btn
      :icon="props.icon"
      :label="props.name"
      stack
      glossy
      color="purple"
      @click="() => addFrameAppendix(props.name, props.renderer, props.camera)"
    />
  </div>
</template>
<script setup lang="ts">
import * as points from '../Environment/points'
import * as THREE from 'three'
import * as f from '@/components/Environment/functions'

const props = withDefaults(
  defineProps<{
    name: string
    icon: string
    renderer: THREE.WebGLRenderer
    camera: THREE.Camera
  }>(),
  {
    name: '',
    icon: ''
  }
)

async function addFrameAppendix(name: string, renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
  const { maxTop, maxRight } = points.getMaxPoints(props.name)
  console.log('Initial points array: ', points.points)

  if (props.name === 'Add Up') {
    points.points.splice(
      2,
      0,
      new THREE.Vector3(maxTop.point2.x, maxTop.point2.y + 1, maxTop.point2.z)
    )
    points.points.splice(
      2,
      0,
      new THREE.Vector3(maxTop.point1.x, maxTop.point1.y + 1, maxTop.point1.z)
    )
  }
  if (props.name === 'Add Right') {
    points.points.splice(
      2,
      0,
      new THREE.Vector3(maxRight.point1.x + 1, maxRight.point1.y, maxRight.point1.z)
    )
    points.points.splice(
      2,
      0,
      new THREE.Vector3(maxRight.point2.x + 1, maxRight.point2.y, maxRight.point2.z)
    )
  }
  console.log('points push: ', points.points)

  f.addPieces()
}
</script>
<style lang=""></style>
