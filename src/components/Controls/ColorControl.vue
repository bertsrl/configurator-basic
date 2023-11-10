<style>
.picker {
  flex-wrap: wrap !important;
  height: auto;
}

.picker > div {
  height: 25px;
  width: 25px;
  padding: 30px;
  margin: 15px;
}
</style>

<template>
  <q-btn-toggle v-model="selectedColor" toggle-color="positive" class="picker" flat :options="[]">
    <div v-for="option in props.options" :key="option.value">
      <q-btn :color="option.value" @click="changePlasticColor(option.value)" />
      <p>{{ option.label }}</p>
    </div>
  </q-btn-toggle>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color_value: string
    options: { value: string; label: string }[]
  }>(),
  {
    color_value: ''
  }
)

import { ref, computed, toRaw } from 'vue'
import * as THREE from 'three'
import * as store from '@/store'

const emit = defineEmits(['update:color_value'])

const selectedColor = computed<string>({
  set: (val) => emit('update:color_value', val),
  get: () => props.color_value
})

function changePlasticColor(color: string) {
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
            rehau_component.children[0].material.color = new THREE.Color(color)
            rehau_component.children[1].material.color = new THREE.Color(color)
            rehau_component.children[5].material.color = new THREE.Color(color)
            rehau_component.children[7].material.color = new THREE.Color(color)
            rehau_component.children[8].material.color = new THREE.Color(color)
            rehau_component.children[9].material.color = new THREE.Color(color)
          }
        }
    }
  }

  selectedColor.value = color
}
</script>
