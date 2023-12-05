<template>
  <div :class="props.class" style="position: absolute; top: 10vh; right: -40%">
    <div class="q-pa-md rounded-borders" style="width: 25vw">
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="text-h6">
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
    <div class="q-pa-md rounded-borders" style="width: 25vw; z-index: 999">
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
import { ref, defineProps, defineAsyncComponent } from 'vue'
import * as store from '@/store'

import SliderComponent from '@/components/Controls/SizeControl/SliderComponent.vue'
import SizeInputs from '@/components/Controls/SizeControl/SizeInputs.vue'

const props = withDefaults(
  defineProps<{
    class: string
    configPanelId: number
  }>(),
  {
    configPanelId: 0
  }
)

const panelMinSize = ref(0)
const panelMaxSize = ref(30)
const panelMinW = ref(0)
const panelMaxW = ref(20)

const mappedValue1030 = ref()
const mappedValue01 = ref()
</script>
<style lang=""></style>
