<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as f from '@/components/Environment/functions'
import * as settings from '@/components/Environment/Settings/index'
import * as store from '@/store'
/**
 * Base
 */
THREE.ColorManagement.enabled = false
THREE.Cache.enabled = true

onMounted(async () => {
  // Create an axis helper
  // const axisHelper = new THREE.AxesHelper(0.4)
  // f.addToScene(axisHelper)

  f.addToScene(settings.ambientLight)
  f.addToScene(settings.light)
  f.addToScene(settings.light2)

  f.addToScene(settings.plane)

  // Background
  f.scene.background = new THREE.Color(0xe8eddf)
  // f.scene.fog = new THREE.Fog(0xdedede, 1, 5)

  //Camera
  f.camera.position.set(0, 0, 11)

  f.addToScene(f.camera)
})
</script>
<style></style>
