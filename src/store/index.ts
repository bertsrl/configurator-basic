import { reactive, ref } from 'vue'

import { defineStore } from 'pinia'

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
