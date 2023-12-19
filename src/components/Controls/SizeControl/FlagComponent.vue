<template>
  <div
    :class="
      props.propClass +
      ' q-slider__pin q-slider__pin--h absolute fit no-pointer-events ' +
      flagSwitched
    "
  >
    <div
      class="q-slider__label q-slider__label--h q-slider__label--h-standard"
      :style="'min-width: 20px' + props.propStyle"
    >
      <div
        class="q-slider__text-container q-slider__text-container--h q-slider__text-container--h-standard"
        style="transform: translateX(calc(-2px + 10%))"
      >
        <span class="q-slider__text">{{ props.value }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    propClass: string
    value: number
    switchFlag: boolean
    propStyle?: string
  }>(),
  {
    propClass: '',
    number: 0,
    switchFlag: false,
    propsStyle: ''
  }
)

const flagSwitched = computed(() => {
  return props.switchFlag ? 'q-slider__pin--h-switched' : 'q-slider__pin--h-standard'
})
</script>
<style lang="scss">
.q-slider__label--h {
  left: -10px;
  transform: unset;
}
.q-slider__pin--h-switched {
  top: 23px !important;
  > div {
    top: 7px !important;
  }
}
.q-slider__pin--h-standard {
  top: -5vh !important;
  left: 0 !important;
}
</style>
