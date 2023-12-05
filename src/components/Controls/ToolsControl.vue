<template>
  <div class="toolbox" style="border-radius: 50%">
    <q-list dark bordered separator class="no-border">
      <q-item clickable v-ripple @click="store.windowChange.value = true">
        <q-item-section>
          <q-icon size="32px" color="primary" name="restart_alt" />
          <q-item-label>Reset</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-icon size="42px" color="primary" name="" />
          <q-item-label>Drag</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        @click="store.isMetricsEnabled.value = metricsVisibility"
        :disable="store.isProfileLook.value ? true : false"
      >
        <q-item-section>
          <q-item-section>
            <q-icon size="32px" color="primary" name="square_foot" />
            <q-item-label>Metrics</q-item-label>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item
        v-if="!store.isProfileLook.value"
        clickable
        v-ripple
        @click="store.isProfileLook.value = profileLook"
      >
        <q-item-section>
          <q-item-section>
            <q-icon size="32px" color="primary" name="crop_free" />
            <q-item-label>Profile</q-item-label>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item v-else clickable v-ripple @click="store.isWindowLook.value = windowLook">
        <q-item-section>
          <q-item-section>
            <q-icon size="32px" color="primary" name="window" />
            <q-item-label>Window</q-item-label>
          </q-item-section>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import * as store from '@/store'
import * as f from '@/components/Environment/functions'
import * as THREE from 'three'
import { compute } from 'three/examples/jsm/nodes/Nodes.js'

const dragActive = ref(true)

const metricsVisibility = computed(() => {
  return store.isMetricsEnabled.value ? false : true
})

const profileLook = computed(() => {
  store.isWindowLook.value = false
  return store.isProfileLook.value ? false : true
})
const windowLook = computed(() => {
  store.isProfileLook.value = false
  return store.isWindowLook.value ? false : true
})
</script>
<style lang="scss" scoped>
@media only screen and (max-width: 992px) {
  .toolbox {
    position: absolute;
    left: 1vw;
    top: 18vh;
    .q-list {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > div {
        background-color: rgba(0, 0, 0, 0.5);
        max-width: 99%;
      }
      .q-item:first-child {
        border: 0px;
        border-radius: 50% 50% 0 0;
        padding: 0.8vh 3vw;
      }

      .q-item:last-child {
        border-radius: 0 0 50% 50%;
        padding: 0.8vh 2.7vw;
      }
    }
  }
}
@media only screen and (min-width: 992px) {
  .toolbox {
    position: absolute;
    left: 1vw;
    top: 35%;
    .q-list {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > div {
        background-color: rgba(0, 0, 0, 0.5);
        max-width: 99%;
      }
      .q-item:first-child {
        border: 0px;
        border-radius: 50% 50% 0 0;
        padding: 0.8vh 1.15vw;
      }

      .q-item:last-child {
        border: 1px;
        border-radius: 0 0 50% 50%;
        padding: 0.8vh 1vw;
      }
    }
  }
}
</style>
