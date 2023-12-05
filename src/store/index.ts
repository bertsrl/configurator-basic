import { reactive, ref, watch } from 'vue'

import { defineStore } from 'pinia'
import {type Control } from "@/types"

export const isLoading = ref(false)
export const isDraggable = ref(true)
export const isCameraswitchSelected = ref(false)
export const isMetricsEnabled = ref(true)
export const isProfileLook = ref(false)
export const isWindowLook = ref(false)
export const windowChange = ref(false)
export const helpersControls = ref(true)

export const productRefMorphMeshes = ref([])

export const meters = reactive({
  x: ref(),
  y: ref()
})

export const windowRef = ref()

export const textMeshes = reactive({
   windowWidthText: ref(),
   windowHeightText: ref()
})

export const units = reactive({
   width: ref(0),
   height: ref(0)
})

export const profileRef = ref()

export function resetValues() {
  meters.x = 0
  meters.y = 0
  
  units.width = 0
  units.height = 0
} 

export const mappedValues = reactive({
  width: ref(0),
  height: ref(0)
})

export const showCard1 = ref(true)
export const showCard2 = ref(false)

export function toggleCards() {
  showCard1.value = !showCard1.value
  showCard2.value = !showCard2.value
  console.log(showCard1.value, showCard2.value)
}

export const controlsArray = reactive(<Control[]>[
  { id: 0, name: 'Width', minSize: ref(0), maxSize: 30, minW: 0, maxW: 20, mappedValue1030: ref(0), mappedValue01: 0 }, 
  { id: 1, name: 'Height', minSize: ref(0), maxSize: 61, minW: 0, maxW: 100, mappedValue1030: ref(0), mappedValue01: 0 }
])

watch(controlsArray[0], (newVal) => {
  if (newVal.maxSize) {
    console.log(newVal)
  }
})

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: state => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
