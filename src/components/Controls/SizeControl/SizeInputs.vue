<template>
  <div>
    <div :class="{ 'col-16': $q.screen.width === 1200, 'col-24': $q.screen.width === 600 }">
      <p class="col-3 q-py-sm">Window limits</p>
      <div class="row col-12">
        <q-skeleton
          class="col-12 q-mx-sm no-arrows-input q-py-md q-mb-sm"
          v-if="updatingData"
          type="QInput"
        />
        <field-component
          v-else
          v-model:field-model="localMinSize"
          :active-value="activeMinSize"
          :validation-rule="validateMinSize(localMinSize)"
          name="Min Size"
          v-model:change-produced="changeProduced.minSize"
          :errors="checkErrors()"
        />
        <q-skeleton
          class="col-12 q-mx-sm no-arrows-input q-py-md q-mb-sm"
          v-if="updatingData"
          type="QInput"
        />
        <field-component
          v-else
          v-model:field-model="localMaxSize"
          :active-value="activeMaxSize"
          :validation-rule="validateMaxSize(localMaxSize)"
          name="Max Size"
          v-model:change-produced="changeProduced.maxSize"
          :errors="checkErrors()"
        />
      </div>
    </div>
    <div :class="{ 'col-6': $q.screen.width === 1200, 'col-12': $q.screen.width === 600 }">
      <p class="col-3">Warranty limits</p>
      <div class="row">
        <q-skeleton
          class="col-12 q-mx-sm no-arrows-input q-py-md q-mb-sm"
          v-if="updatingData"
          type="QInput"
        />
        <field-component
          v-else
          v-model:field-model="localMinW"
          :active-value="activeMinW"
          :validation-rule="validateMinW(localMinW)"
          name="Min Warranty"
          v-model:change-produced="changeProduced.minW"
          :errors="checkErrors()"
        />
        <q-skeleton
          class="col-12 q-mx-sm no-arrows-input q-py-md q-mb-sm"
          v-if="updatingData"
          type="QInput"
        />
        <field-component
          v-else
          v-model:field-model="localMaxW"
          :active-value="activeMaxW"
          :validation-rule="validateMaxW(localMaxW)"
          name="Max Warranty"
          v-model:change-produced="changeProduced.maxW"
          :errors="checkErrors()"
        />
      </div>
    </div>
    <div class="row items-center col-12">
      <p v-if="!updatingData" style="margin-right: 3.25vw">Initial displayed value:</p>
      <q-skeleton
        class="col-12 q-mx-sm no-arrows-input q-py-md q-mb-sm"
        v-if="updatingData"
        type="QInput"
      />
      <field-component
        v-else
        v-model:field-model="localDisplayed"
        :active-value="activeDisplayed"
        :validation-rule="validateDisplayed(localDisplayed)"
        name="Displayed"
        v-model:change-produced="changeProduced.displayed"
        :errors="checkErrors()"
      />
    </div>
    <q-btn v-if="!updatingData" :disable="!enableSubmit" @click="updateInputsData">
      Submit Change
    </q-btn>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted, onBeforeMount } from 'vue'
import * as store from '@/store'
import { collection, getDocs } from 'firebase/firestore'
import { updateDocument } from '@/firebase'
import { type Control } from '@/types'
import FieldComponent from './FieldComponent.vue'

const localMinSize = ref()
const localMaxSize = ref()
const localMinW = ref()
const localMaxW = ref()
const localDisplayed = ref()

const props = withDefaults(
  defineProps<{
    controlId: number
  }>(),
  {}
)

// const localMinSize = ref(store.controlsArray[props.controlId].minSize)
// const localMaxSize = ref(store.controlsArray[props.controlId].maxSize)
// const localMinW = ref(store.controlsArray[props.controlId].minW)
// const localMaxW = ref(store.controlsArray[props.controlId].maxW)

const changeProduced = reactive({
  minSize: ref(false),
  maxSize: ref(false),
  minW: ref(false),
  maxW: ref(false),
  displayed: ref(false)
})

const enableSubmit = ref(false)

// watch(changeProduced, (newVal, preVal) => {
//   if (
//     newVal.minSize === true ||
//     newVal.maxSize === true ||
//     newVal.minW === true ||
//     newVal.maxW === true ||
//     newVal.displayed === true
//   ) {
//     enableSubmit.value = true
//   } else {
//     enableSubmit.value = false
//   }
// })

function checkErrors() {
  if (errors.minSize || errors.maxSize || errors.minW || errors.maxW || errors.displayed) {
    enableSubmit.value = false
  } else if (
    changeProduced.minSize ||
    changeProduced.maxSize ||
    changeProduced.minW ||
    changeProduced.maxW ||
    changeProduced.displayed
  ) {
    enableSubmit.value = true
  } else enableSubmit.value = false
}

const activeMinSize = ref(0)
const activeMaxSize = ref(0)
const activeMinW = ref(0)
const activeMaxW = ref(0)
const activeDisplayed = ref(0)

const newMinSize = ref()
const newMaxSize = ref()
const newMinW = ref()
const newMaxW = ref()
const newDisplayed = ref()

const errors = reactive({
  minSize: false,
  maxSize: false,
  minW: false,
  maxW: false,
  displayed: false
})

function updateActives() {
  localMinSize.value = store.controlsArray[props.controlId].minSize
  localMaxSize.value = store.controlsArray[props.controlId].maxSize
  localMinW.value = store.controlsArray[props.controlId].minW
  localMaxW.value = store.controlsArray[props.controlId].maxW
  localDisplayed.value = store.controlsArray[props.controlId].displayed

  activeMinSize.value = store.controlsArray[props.controlId].minSize
  activeMaxSize.value = store.controlsArray[props.controlId].maxSize
  activeMinW.value = store.controlsArray[props.controlId].minW
  activeMaxW.value = store.controlsArray[props.controlId].maxW
  activeDisplayed.value = store.controlsArray[props.controlId].displayed
}

const updatingData = ref(true)

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { cos } from 'three/examples/jsm/nodes/Nodes.js'

onBeforeMount(async () => {
  updatingData.value = true

  setTimeout(() => {
    updateActives()

    updatingData.value = false
  }, 2000)
})

async function updateInputsData() {
  updatingData.value = true

  const newValues = {
    minSize: localMinSize.value,
    maxSize: localMaxSize.value,
    minW: localMinW.value,
    maxW: localMaxW.value,
    displayed: localDisplayed.value,
    name: store.controlsArray[props.controlId].name,
    type: 'slider'
  }

  await store.updateControlsFromDB(store.controlsArray[props.controlId].name, newValues)

  changeProduced.minW = false
  changeProduced.maxW = false
  changeProduced.minSize = false
  changeProduced.maxSize = false
  changeProduced.displayed = false

  setTimeout(async () => {
    await store.getControlsFromDB()
    updateActives()

    toast.success(`${store.controlsArray[props.controlId].name} limits data updated!`, {
      autoClose: 5000,
      position: toast.POSITION.BOTTOM_CENTER
    })
    updatingData.value = false
  }, 2000)
}

watch(localMinSize, (newVal, preVal) => {
  if (newVal)
    if (newVal !== store.controlsArray[props.controlId].minSize) {
      newMinSize.value = newVal
    }
})
watch(localMaxSize, (newVal, preVal) => {
  if (newVal)
    if (newVal !== store.controlsArray[props.controlId].maxSize) {
      newMaxSize.value = newVal
    }
})
watch(localMinW, (newVal, preVal) => {
  if (newVal)
    if (newVal !== store.controlsArray[props.controlId].minW) {
      newMinW.value = newVal
    }
})
watch(localMaxW, (newVal, preVal) => {
  if (newVal)
    if (newVal !== store.controlsArray[props.controlId].maxW) {
      newMaxW.value = newVal
    }
})
watch(localDisplayed, (newVal, preVal) => {
  if (newVal)
    if (newVal !== store.controlsArray[props.controlId].displayed) {
      newDisplayed.value = newVal
    }
})

// VALIDATIONS
function validateMinSize(value: number) {
  const visibleMaxSizeValue = newMaxSize.value ? newMaxSize.value : activeMaxSize.value

  const verdict = value < visibleMaxSizeValue ? true : false

  if (verdict) {
    errors.minSize = false
    return true
  } else {
    errors.minSize = true
    store.loggerText.value = 'Minimum size of the product must be less than the maximum size'
    return
  }
}

function validateMaxSize(value: number) {
  const visibleMinSizeValue = newMinSize.value ? newMinSize.value : activeMinSize.value
  const verdict = value > visibleMinSizeValue ? true : false

  if (verdict) {
    errors.maxSize = false
    return true
  } else {
    errors.maxSize = true
    store.loggerText.value = 'Minimum size of the product must be less than the maximum size'
    return
  }
}

function validateMinW(value: number) {
  const visibleMinSizeValue = newMinSize.value ? newMinSize.value : activeMinSize.value
  const visibleMaxSizeValue = newMaxSize.value ? newMaxSize.value : activeMaxSize.value
  const visibleMaxW = newMaxW.value ? newMaxW.value : activeMaxW.value

  const isBetweenSizeLimits = computed(() => {
    const verdict = value >= visibleMinSizeValue && value <= visibleMaxSizeValue ? true : false

    return verdict
  })

  const isLessThanMaxW = computed(() => {
    const verdict = value < visibleMaxW ? true : false
    return verdict
  })

  if (isBetweenSizeLimits.value) {
    if (isLessThanMaxW.value) {
      errors.minW = false
      return true
    } else {
      store.loggerText.value = 'Minimum Warranty limit must be less that the maximum warranty limit'
      errors.minW = true
    }
  } else {
    errors.minW = true
    store.loggerText.value = 'Minimum Warranty limit must be between the size limits'
  }
}

function validateMaxW(value: number) {
  const visibleMinSizeValue = newMinSize.value ? newMinSize.value : activeMinSize.value
  const visibleMaxSizeValue = newMaxSize.value ? newMaxSize.value : activeMaxSize.value
  const visibleMinW = newMinW.value ? newMinW.value : activeMinW.value

  const isBetweenSizeLimits = computed(() => {
    const verdict = value >= visibleMinSizeValue && value <= visibleMaxSizeValue ? true : false
    return verdict
  })
  const isGreaterThanMinW = computed(() => {
    const verdict = value > visibleMinW ? true : false
    return verdict
  })

  if (isBetweenSizeLimits.value) {
    if (isGreaterThanMinW.value) {
      errors.maxW = false
      return true
    } else {
      store.loggerText.value =
        'Maximum Warranty limit must be greater than the Minimum Warranty limit'
      errors.maxW = true
    }
  } else {
    errors.maxW = true
    store.loggerText.value = 'Maximum Warranty limit must be between the size limits'
  }
}

function validateDisplayed(value: number) {
  const isValid = computed(() => {
    const verdict =
      (value >= activeMinSize.value && value <= activeMaxSize.value) ||
      (value >= newMinSize.value && value <= newMaxSize.value)
        ? true
        : false
    return verdict
  })

  if (isValid.value) {
    errors.displayed = false
    return isValid.value
  } else {
    store.loggerText.value = `Displayed value must be between ${localMinSize.value} and ${localMaxSize.value}`
    errors.displayed = true
  }
}

// function validateMaxSize(value: number) {
//   const isValid = !isNaN(value) && value > localMaxSize.value
//   return isValid || 'INVALID DATA'
// }
</script>
