<template>
  <div>
    <div :class="{ 'col-6': $q.screen.width === 1200, 'col-12': $q.screen.width === 600 }">
      <div class="row"></div>
      <p class="col-3 q-py-sm">Window limits</p>
      <div class="row">
        <q-input
          class="col-5 q-mx-sm no-arrows-input"
          filled
          type="number"
          v-model="store.controlsArray[props.controlId].minSize"
          label="Min Value"
          stack-label
        />
        <q-input
          class="col-5 q-mx-sm no-arrows-input"
          filled
          type="number"
          v-model="store.controlsArray[props.controlId].maxSize"
          label="Max Value"
          stack-label
        />
      </div>
    </div>
    <div :class="{ 'col-6': $q.screen.width === 1200, 'col-12': $q.screen.width === 600 }">
      <p class="col-3 q-py-sm">Warranty limits</p>
      <div class="row">
        <q-input
          class="col-5 q-mx-sm no-arrows-input"
          filled
          type="number"
          v-model="store.controlsArray[props.controlId].minW"
          label="Min Value"
          stack-label
          no-parent-field
        />
        <q-input
          class="col-5 q-mx-sm no-arrows-input"
          filled
          type="number"
          v-model="store.controlsArray[props.controlId].maxW"
          label="Max Value"
          stack-label
          no-parent-field
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import * as store from '@/store'

const props = withDefaults(
  defineProps<{
    controlId: number
  }>(),
  {}
)

console.log('Props.controlId SizeInputs: ', props.controlId)

// const localMinSize = ref(store.controlsArray[props.controlId].minSize)
// const localMaxSize = ref(store.controlsArray[props.controlId].maxSize)
// const localMinW = ref(store.controlsArray[props.controlId].minW)
// const localMaxW = ref(store.controlsArray[props.controlId].maxW)

watch(store.controlsArray[0], (newVal) => {
  if (newVal) {
    console.log(newVal)
  }
})

// function validateMinSize(value: number) {
//   const isValid = computed(() => {
//     const verdict = value < localMaxSize.value ? true : false
//     return verdict
//   })

//   if (isValid.value) return isValid.value
//   return 'INVALID DATA'
// }
// function validateMaxSize(value: number) {
//   const isValid = !isNaN(value) && value > localMaxSize.value
//   return isValid || 'INVALID DATA'
// }
</script>
