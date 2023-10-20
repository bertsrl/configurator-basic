<script setup lang="ts">
import Experience from './Views/Experience.vue'
import { useCounterStore } from './store/index'
import { toRaw } from 'vue'

const stateCounter = useCounterStore()


</script>

<template>
  <div>
    <Experience />
  </div>
  <div id="license" style="color: #fff; font-size: 3vw">By Bertalan Andrei-Eduard</div>
</template>

<style lang="scss" scoped>
#license {
  position: absolute;
  bottom: 5vh;
  color: green !important;
}
</style>
