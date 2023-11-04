<template>
  <q-btn-group rounded>
    <q-btn
      color="green-6"
      rounded
      glossy
      :icon-right="toggleBoundingBoxes === true ? 'visibility' : 'visibility_off'"
      label="Bounding Boxes"
      @click="
        () => {
          console.log('boundingBoxesRef.value: ', toRaw(boundingBoxesRef))
          f.toggleHelpersFn(boundingBoxesRef, toggleBoundingBoxes)
          toggleBoundingBoxes = toggleBoundingBoxes === true ? false : true
        }
      "
    />
    <q-btn
      color="green-8"
      rounded
      glossy
      :icon-right="toggleLimitPoints === true ? 'visibility' : 'visibility_off'"
      label="Limit Points"
      @click="
        () => {
          f.toggleHelpersFn(limitPointsRef, toggleLimitPoints)
          toggleLimitPoints = toggleLimitPoints === true ? false : true
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
          console.log('fillMEshesRef.value: ', fillMeshesRef.value)
          f.toggleHelpersFn(fillMeshesRef, toggleFill)
          toggleFill = toggleFill === true ? false : true
        }
      "
    />
  </q-btn-group>
</template>
<script setup>
import * as THREE from 'three'
import { ref, onMounted, toRaw } from 'vue'
import * as f from '@/components/Environment/functions'
import {
  boundingBoxes,
  fillMeshes,
  limitPoints,
  computeProduct
} from '../Environment/Products/InitializeProduct'
import { productRefMorphMeshes } from '@/store'
import * as dat from 'lil-gui'

const toggleBoundingBoxes = ref(true)
const toggleLimitPoints = ref(true)
const toggleFill = ref(true)

const boundingBoxesRef = ref([])
const fillMeshesRef = ref([])
const limitPointsRef = ref([])

console.log('limitPoints: ', limitPoints, 'boundingBoxes: ', boundingBoxes)
// Debug
const gui = new dat.GUI()

onMounted(async () => {
  boundingBoxesRef.value = boundingBoxes
  fillMeshesRef.value = fillMeshes
  limitPointsRef.value = limitPoints
})
</script>
<style lang=""></style>
