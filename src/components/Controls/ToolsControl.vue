<template>
  <div class="toolbox" style="border-radius: 50%">
    <q-list dark bordered separator class="no-border">
      <q-item clickable v-ripple>
        <q-item-section>
          <q-icon size="32px" color="primary" name="restart_alt" />
          <q-item-label>Reset</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="store.isMetricsEnabled.value = metricsVisibility">
        <q-item-section>
          <q-item-section>
            <q-icon size="32px" color="primary" name="square_foot" />
            <q-item-label>Metrics</q-item-label>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="store.isProfileLook.value = profileLook">
        <q-item-section>
          <q-item-section>
            <q-icon size="32px" color="primary" name="crop_free" />
            <q-item-label>Profile</q-item-label>
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
  return store.isProfileLook.value ? false : true
})
</script>
<style lang="scss" scoped>
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
    div:first-child {
      border: 0px;
      border-radius: 50% 50% 0 0;
    }

    div:last-child {
      border-radius: 0 0 50% 50%;
    }
  }
}
</style>
