<template>
  <div
    :class="props.class"
    :style="{
      position: 'absolute',
      top: '10vh',
      right: $q.screen.width >= 1200 ? '-40%' : $q.screen.width >= 600 ? '-65%' : 'auto'
    }"
  >
    <div class="q-pa-md rounded-borders" style="width: inherit">
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <q-btn flat class="q-my-sm" @click="store.switchToMainPanel"
            ><q-icon name="arrow_back" /> Back
          </q-btn>
          <div class="text-h6 q-pl-md">
            Configure {{ store.controlsArray[props.configPanelId].name }} Limits
          </div>
          <div class="row q-mb-sm items-start">
            <div class="row inline">
              <q-item>
                <!-- Size inputs here -->
                <size-inputs :controlId="configPanelId" />
              </q-item>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-md rounded-borders" style="width: inherit; z-index: 999">
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <!-- Slider component here -->
          <slider-component aria-readonly="true" :controlId="configPanelId" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar'
import * as store from '@/store'

import SliderComponent from '@/components/Controls/SizeControl/SliderComponent.vue'
import SizeInputs from '@/components/Controls/SizeControl/SizeInputs.vue'

const q = useQuasar()

const props = withDefaults(
  defineProps<{
    class: string
    configPanelId: number
  }>(),
  {}
)
</script>
<style lang=""></style>
