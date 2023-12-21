<style lang="scss">
.q-slider__marker-labels {
  display: none;
}

.active-minw {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  .child-flag {
    width: 1px;
    height: 1rem;
    background-color: #000;
    position: absolute;
    top: -12px;
  }
}
.active-maxw {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  .child-flag {
    width: 1px;
    height: 1rem;
    background-color: #000;
    position: absolute;
    top: -12px;
  }
}

.q-slider {
  margin: 4vh auto;
}

.min-s-limit {
  margin-left: -0.5vw;
  margin-top: 1.2vw;
  .q-slider__label--h {
    left: 0 !important;
  }
}
.max-s-limit {
  margin-left: 2.1vw;
  margin-top: 1.2vw;
  .q-slider__label--h {
    left: unset !important;
    right: 0 !important;
  }
}

.q-slider__pin--h:before {
  display: none;
}

.q-slider__thumb {
  .q-slider__pin--h {
    display: none;
  }
}
</style>

<template>
  <div class="q-py-md" :class="props.controlId === 0 ? 'control-width' : 'control-height'">
    <p class="col-3">Preview {{ props.controlId }}</p>
    <q-skeleton
      class="col-5 q-mx-sm no-arrows-input q-py-md q-mb-sm"
      v-if="updatingData"
      type="QInput"
    />
    <q-input
      v-else
      class="q-mx-sm no-arrows-input"
      filled
      type="number"
      v-model="store.controlsArray[props.controlId].mappedValue1030"
      :label="store.controlsArray[props.controlId].name"
      stack-label
      :dense="dense"
    />
    <!-- <div
      class="row"
      style="margin-left: 5px; margin-top: 1.7rem; width: 24rem; justify-content: center"
    >
      <div>SIZE LIMITS</div>
      <div class="bg-black" style="width: 24.2rem; height: 1px"></div>
    </div>
    <div class="row" style="width: 24.2rem; justify-content: space-between; margin-bottom: -12px">
      <div class="column">
        <div class="bg-black" style="width: 0.1px; height: 15px; margin-left: 0.5rem"></div>
        <div style="width: 0.1px; margin-left: 5px">
          {{ store.controlsArray[props.controlId].minSize }}
        </div>
        <div class="bg-black" style="width: 0.1px; height: 15px; margin-left: 0.5rem"></div>
      </div>
      <div class="column">
        <div class="bg-black" style="width: 0.1px; height: 15px; margin-left: 0.5rem"></div>
        <div style="width: 0.1px; margin-left: 2px">
          {{ store.controlsArray[props.controlId].maxSize }}
        </div>
        <div class="bg-black" style="width: 0.1px; height: 15px; margin-left: 0.5rem"></div>
      </div>
    </div> -->

    <div class="slider">
      <q-skeleton
        class="col-5 q-mx-sm no-arrows-input q-py-md q-mb-sm"
        v-if="updatingData"
        type="QSlider"
      />
      <q-slider
        v-else
        class="q-px-sm q-my-none"
        v-model="store.controlsArray[props.controlId].mappedValue1030"
        :min="+store.controlsArray[props.controlId].minSize"
        :max="+store.controlsArray[props.controlId].maxSize"
        :step="1"
        :color="checkWarranty() ? 'green' : 'red'"
        track-size="8px"
        label-always
        marker-labels
      >
      </q-slider>
    </div>
    <!-- <div class="row" style="margin-left: 3px; width: 24.2rem; justify-content: center">
      <div class="bg-black" style="width: 24.2rem; height: 1px"></div>
      <div>WARRANTY LIMITS</div>
    </div> -->
    <div v-if="!checkWarranty() && !updatingData">
      <p class="text-subtitle1 color-red">
        The {{ store.controlsArray[props.controlId].name }} of the window is out of the warranty
        range!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as store from '@/store'
import FlagComponent from './FlagComponent.vue'

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

import {
  ref,
  computed,
  watch,
  watchEffect,
  onMounted,
  onUpdated,
  onBeforeUpdate,
  onBeforeMount
} from 'vue'

const dense = ref(true)

const emit = defineEmits(['update:sizeProp'])

const size = computed<number>({
  set: (val) => emit('update:sizeProp', val),
  get: () => props.sizeProp
})

const updatingData = ref(false)

onMounted(() => {
  updatingData.value = true

  setTimeout(() => {
    store.controlsArray[props.controlId].mappedValue1030 =
      store.controlsArray[props.controlId].displayed

    updatingData.value = false
  }, 1000)
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
  return warranty.value
}

watch(
  () => store.controlsArray[props.controlId].minSize,
  (newVal: number) => {
    if (store.productLoaded.value && !store.configurePanelOpen)
      store.controlsArray[props.controlId].mappedValue1030 = newVal
  }
)
watch(
  () => store.controlsArray[props.controlId].displayed,
  (newVal: number) => {
    if (store.productLoaded.value) store.controlsArray[props.controlId].mappedValue1030 = newVal
  }
)

watchEffect(() => {
  if (store.controlsArray[props.controlId]?.mappedValue1030) {
    const percentage =
      (store.controlsArray[props.controlId].mappedValue1030 -
        store.controlsArray[props.controlId].minSize) /
      (store.controlsArray[props.controlId].maxSize - store.controlsArray[props.controlId].minSize)
    store.controlsArray[props.controlId].mappedValue01 = Math.min(1, Math.max(0, percentage))

    switch (props.controlId) {
      case 0:
        store.units.width = store.controlsArray[props.controlId].mappedValue1030!
        size.value = store.controlsArray[props.controlId].mappedValue01!
        break
      case 1:
        store.units.height = store.controlsArray[props.controlId].mappedValue1030!
        size.value = store.controlsArray[props.controlId].mappedValue01!
        break
    }
  }
  if (store.controlsArray[props.controlId].mappedValue01) {
    size.value = store.controlsArray[props.controlId].mappedValue01!
  }
})

watch(
  () => store.controlsArray[props.controlId].mappedValue1030,
  (newVal) => {
    if (
      newVal < store.controlsArray[props.controlId].minSize ||
      newVal > store.controlsArray[props.controlId].maxSize
    )
      store.controlsArray[props.controlId].mappedValue1030 =
        store.controlsArray[props.controlId].minSize
  }
)

import { app } from '@/firebase'
import { getFirestore } from 'firebase/firestore'
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
