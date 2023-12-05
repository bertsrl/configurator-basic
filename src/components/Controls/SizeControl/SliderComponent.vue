<template>
  <div class="control-width q-py-md">
    <p class="col-3 q-py-sm">Preview</p>
    <q-input
      class="q-mx-sm no-arrows-input"
      filled
      type="number"
      v-model="store.controlsArray[props.controlId].mappedValue1030"
      :label="store.controlsArray[props.controlId].name"
      stack-label
      :dense="dense"
    />
    <q-slider
      class="q-px-sm"
      v-model="store.controlsArray[props.controlId].mappedValue1030"
      :min="+store.controlsArray[props.controlId].minSize"
      :max="+store.controlsArray[props.controlId].maxSize"
      :step="0.1"
      :color="checkWarranty() ? 'green' : 'red'"
      marker-labels
      track-size="8px"
      markers
    />
    <div v-if="!checkWarranty()">
      <p class="text-subtitle1 color-red">
        The {{ store.controlsArray[props.controlId].name }} of the window is out of the warranty
        range!
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as store from '@/store'
import { update } from 'node_modules/@tweenjs/tween.js/dist/tween'
import { toRaw } from 'vue'
const props = withDefaults(
  defineProps<{
    controlId: number
    sizeProp: number
  }>(),
  {
    controlId: 0,
    sizeProp: 0
  }
)

console.log('Props.controlId Slider: ', props.controlId)

const localMinSize = ref(store.controlsArray[props.controlId].minSize)
const localMaxSize = ref(store.controlsArray[props.controlId].maxSize)
const localMinW = ref(store.controlsArray[props.controlId].minW)
const localMaxW = ref(store.controlsArray[props.controlId].maxW)

const localMappedValue1030 = ref(store.controlsArray[props.controlId].mappedValue1030)
const localMappedValue01 = ref(store.controlsArray[props.controlId].mappedValue01)

import { ref, computed, watch, watchEffect, onMounted, onUpdated, onBeforeUpdate } from 'vue'

const containerRef = ref()
const markersRef = ref()

// Function to update marker labels
function updateMarkerLabelsBottom(value) {
  if (containerRef.value) {
    console.log('markers: ', markersRef.value)
    markersRef.value.forEach((marker, index) => {
      // Show markers at position 3 and 7
      if (index === value * 10) {
        marker.style.display = 'block'
        marker.textContent = `${value}` // Set your custom label
      }
    })
  }
}

onMounted(() => {
  containerRef.value = document.querySelector('.controls-iter')
  markersRef.value = containerRef.value!.querySelectorAll('.q-slider__marker-labels')

  markersRef.value.forEach((marker) => {
    // Hide all markers
    marker.style.display = 'none'
  })

  updateMarkerLabelsBottom(store.controlsArray[props.controlId].minW)
  updateMarkerLabelsBottom(store.controlsArray[props.controlId].maxW)
})

onUpdated(() => {
  updateMarkerLabelsBottom(store.controlsArray[props.controlId].minW)
  updateMarkerLabelsBottom(store.controlsArray[props.controlId].maxW)
})

const dense = ref(true)

const emit = defineEmits(['update:sizeProp'])

const size = computed<number>({
  set: (val) => emit('update:sizeProp', val),
  get: () => props.sizeProp
})

function checkWarranty() {
  const warranty = computed(() => {
    if (
      store.controlsArray[props.controlId].mappedValue1030! >=
        store.controlsArray[props.controlId].minW &&
      store.controlsArray[props.controlId].mappedValue1030! <=
        store.controlsArray[props.controlId].maxW
    )
      return true
    else if (store.controlsArray[props.controlId].mappedValue1030 === undefined) return true
    return false
  })
  console.log(
    'mappedValue1030: ',
    store.controlsArray[props.controlId].mappedValue1030,
    'minW: ',
    store.controlsArray[props.controlId].minW,
    'maxW: ',
    store.controlsArray[props.controlId].maxW
  )
  console.log('WAARRANTYY: ', warranty.value)
  return warranty.value
}

watch(store.controlsArray[props.controlId]?.minSize, (newVal: unknown) => {
  store.controlsArray[props.controlId].mappedValue1030 = newVal
  switch (props.controlId) {
    case 0:
      store.units.width = store.controlsArray[props.controlId].mappedValue1030!
      break
    case 1:
      store.units.height = store.controlsArray[props.controlId].mappedValue1030!
      break
  }
})

watchEffect(() => {
  if (store.controlsArray[props.controlId]?.mappedValue1030) {
    console.log('BAAAAA')
    const percentage =
      (store.controlsArray[props.controlId].mappedValue1030 -
        store.controlsArray[props.controlId].minSize) /
      (store.controlsArray[props.controlId].maxSize - store.controlsArray[props.controlId].minSize)
    store.controlsArray[props.controlId].mappedValue01 = Math.min(1, Math.max(0, percentage))

    console.log(percentage)
    console.log(store.controlsArray[props.controlId].mappedValue01)

    switch (props.controlId) {
      case 0:
        store.units.width = store.controlsArray[props.controlId].mappedValue1030!
        size.value = store.controlsArray[props.controlId].mappedValue01!

        console.log('BAAAAAA PL::', size.value)
        break
      case 1:
        store.units.height = store.controlsArray[props.controlId].mappedValue1030!
        size.value = store.controlsArray[props.controlId].mappedValue01!
        break
    }

    updateMarkerLabelsBottom(store.controlsArray[props.controlId].minW)
    updateMarkerLabelsBottom(store.controlsArray[props.controlId].maxW)
  }
  if (store.controlsArray[props.controlId].mappedValue01) {
    console.log('Size.value: ', size.value)
    size.value = store.controlsArray[props.controlId].mappedValue01!
  }
})
</script>
<style>
@import 'material-icons/iconfont/material-icons.css';
.no-arrows-input input[type='number'] {
  -webkit-appearance: textfield;
  margin: 0;
}
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
