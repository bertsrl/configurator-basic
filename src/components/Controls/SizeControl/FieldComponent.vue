<template>
  <div>
    <q-badge v-if="changeProducedValue" color="lime-6"> Modified </q-badge>
    <div v-else class="q-my-sm"></div>
    <q-input
      class="col-3 q-mx-sm no-arrows-input"
      filled
      type="number"
      v-model.number="fieldValue"
      :label="props.name"
      stack-label
      :bg-color="bgColor"
      @input="errors"
      :error="validationRule ? false : true"
    />
  </div>
</template>
<script setup lang="ts">
import type { Control } from '@/types'
import { ref, watch, onMounted, computed } from 'vue'
import type { Ref } from 'vue'
import * as store from '@/store'

const props = withDefaults(
  defineProps<{
    fieldModel: number
    activeValue: number
    validationRule: boolean | undefined
    name: string
    changeProduced: boolean
    errors?: void
  }>(),
  {}
)

const initialValue = ref()
const bgColor = ref()

const emit = defineEmits(['update:fieldModel', 'update:changeProduced'])

const fieldValue = computed<number | string>({
  set: (val) => emit('update:fieldModel', val),
  get: () => props.fieldModel
})

const changeProducedValue = computed<boolean>({
  set: (val) => emit('update:changeProduced', val),
  get: () => props.changeProduced
})

onMounted(() => {
  initialValue.value = fieldValue.value
})

watch(fieldValue, (newVal, preVal) => {
  if (newVal !== props.activeValue) {
    bgColor.value = 'lime-6'
    changeProducedValue.value = true
  } else {
    bgColor.value = ''
    changeProducedValue.value = false
  }
})
</script>
<style lang=""></style>
