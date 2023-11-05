import { reactive, ref } from 'vue'

import { defineStore } from 'pinia'

export const isLoading = ref(false)

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
