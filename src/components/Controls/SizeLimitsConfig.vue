<template>
  <div>
    <div :class="{ 'col-6': $q.screen.width === 1200, 'col-12': $q.screen.width === 600 }">
      <div class="row"></div>
      <p class="col-3 q-pl-sm">Window limits</p>
      <div class="row">
        <q-input
          class="col-5 q-mx-sm no-arrows-input"
          filled
          type="number"
          v-model="minSize"
          label="Min Value"
          stack-label
          :rules="[validateMinSize]"
        />
        <q-input
          class="col-5 q-mx-sm no-arrows-input"
          filled
          type="number"
          v-model="maxSize"
          label="Max Value"
          stack-label
          :rules="[validateMaxSize]"
        />
      </div>
    </div>
    <div :class="{ 'col-6': $q.screen.width === 1200, 'col-12': $q.screen.width === 600 }">
      <p class="col-3 q-pl-sm">Warranty limits</p>
      <div class="row">
        <q-input
          class="col-5 q-mx-sm no-arrows-input"
          filled
          type="number"
          v-model="minW"
          label="Min Value"
          stack-label
          no-parent-field
        />
        <q-input
          class="col-5 q-mx-sm no-arrows-input"
          filled
          type="number"
          v-model="maxW"
          label="Max Value"
          stack-label
          no-parent-field
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as store from '@/store'

const minSize = ref(0)
const maxSize = ref(30)
const minW = ref(0)
const maxW = ref(20)

const mappedValue1030 = ref()
const mappedValue01 = ref()

const props = withDefaults(
  defineProps<{
    title: string
    size: number
    type: string
  }>(),
  {
    title: '',
    type: ''
  }
)

import { ref, computed, watch, watchEffect } from 'vue'

const dense = ref(true)

const emit = defineEmits(['update:size'])

const size = computed<number>({
  set: (val) => emit('update:size', val),
  get: () => props.size
})

const displayConfigText = ref(false)

function checkWarranty() {
  const warranty = computed(() => {
    if (mappedValue1030.value >= minW.value && mappedValue1030.value <= maxW.value) return true
    else if (mappedValue1030.value === undefined) return true
    return false
  })

  return warranty.value
}

function validateMinSize(value: number) {
  const isValid = computed(() => {
    const verdict = value < maxSize.value ? true : false
    return verdict
  })

  if (isValid.value) return isValid.value
  return 'INVALID DATA'
}
function validateMaxSize(value: number) {
  const isValid = !isNaN(value) && value > minSize.value
  return isValid || 'INVALID DATA'
}

watch(minSize, (newVal) => {
  mappedValue1030.value = newVal
  switch (props.type) {
    case 'width':
      store.units.width = mappedValue1030.value
      break
    case 'height':
      store.units.height = mappedValue1030.value
      break
  }
})

watch(mappedValue1030, (newVal) => {
  const percentage = (newVal - minSize.value) / (maxSize.value - minSize.value)
  mappedValue01.value = Math.min(1, Math.max(0, percentage))

  switch (props.type) {
    case 'width':
      store.units.width = mappedValue1030.value
      break
    case 'height':
      store.units.height = mappedValue1030.value
      break
  }
})

watch(mappedValue01, (newVal) => {
  size.value = newVal
})
</script>
<style></style>
