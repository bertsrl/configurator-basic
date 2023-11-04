import { reactive, ref } from 'vue'

import { defineStore } from 'pinia'

export const productRefMorphMeshes = ref([])
export const boundingBoxesRef = ref([])

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
