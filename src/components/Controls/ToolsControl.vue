<template>
  <div class="toolbox" style="border-radius: 50%">
    <div class="column q-gutter-md fit">
      <!-- Reset Button -->
      <div class="column q-gutter-sm toolbox-btn">
        <q-btn
          size="20px"
          round
          color="grey-10"
          icon="restart_alt"
          @click="store.windowChange.value = true"
        />
        <label class="text-center">Reset</label>
      </div>

      <!-- 360 Buttons -->
      <div class="column q-gutter-sm toolbox-btn" v-if="!store.isSphereLook.value">
        <q-btn
          size="20px"
          round
          color="grey-10"
          icon="360"
          @click="store.isSphereLook.value = sphereLook"
        />
        <label class="text-center">360 View</label>
      </div>

      <div class="column q-gutter-sm toolbox-btn" v-else>
        <q-btn
          size="20px"
          round
          color="grey-10"
          :icon="!store.isSphereLook.value ? '360' : 'flip_to_back'"
          @click="store.isSphereLook.value = sphereLook"
        />
        <label v-if="!store.isSphereLook.value" class="text-center">360 View</label>
        <label v-else class="text-center">Front View</label>
      </div>

      <!-- Meters Buttons -->
      <div class="column q-gutter-sm toolbox-btn">
        <q-btn
          size="20px"
          round
          color="grey-10"
          icon="square_foot"
          @click="store.isMetricsEnabled.value = metricsVisibility"
          :disable="store.isProfileLook.value ? true : false"
        />
        <label class="text-center" v-if="store.isMetricsEnabled.value">Hide Meters</label>
        <label class="text-center" v-else>Show Meters</label>
      </div>

      <!-- View Buttons -->
      <div class="column q-gutter-sm toolbox-btn" v-if="!store.isProfileLook.value">
        <q-btn
          size="20px"
          round
          color="grey-10"
          icon="crop_free"
          @click="store.isProfileLook.value = profileLook"
        />
        <label class="text-center">Profile View</label>
      </div>
      <div class="column q-gutter-sm toolbox-btn" v-else>
        <q-btn
          size="20px"
          round
          color="grey-10"
          icon="crop_free"
          @click="store.isProfileLook.value = profileLook"
        />
        <label class="text-center">Window View</label>
      </div>
    </div>
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
  return store.isProfileLook.value ? false : true
})

const sphereLook = computed(() => {
  return store.isSphereLook.value ? false : true
})
</script>
<style lang="scss" scoped>
@media only screen and (max-width: 992px) {
  .toolbox {
    position: absolute;
    left: 1vw;
    top: 3vh;
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
    .toolbox-btn {
      width: 3.5vw !important;
    }
  }
}
@media only screen and (min-width: 992px) {
  .toolbox {
    position: absolute;
    left: 1vw;
    top: 23vh;
    .toolbox-btn {
      width: 3.5vw !important;
    }
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
