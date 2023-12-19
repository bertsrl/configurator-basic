<template>
  <div class="row wrap">
    <img class="col-3" src="/Profile_info.png" width="250" height="150" />
    <div class="column col-9 q-gutter-md q-px-lg">
      Product Type:
      <q-input class="field" outlined v-model="geneo_specs.type" hide-hint dense readonly />
      Description:
      <q-input
        class="field"
        hide-hint
        outlined
        v-model="geneo_specs.desc"
        hint="Readonly"
        dense
        readonly
      />
      Weight:
      <q-input
        class="field"
        hide-hint
        outlined
        v-model="geneo_specs.weight"
        hint="Readonly"
        dense
        readonly
      />
      Lx:
      <q-input
        class="field"
        hide-hint
        outlined
        v-model="geneo_specs.lx"
        hint="Readonly"
        dense
        readonly
      />
      Ly:
      <q-input
        class="field"
        hide-hint
        outlined
        v-model="geneo_specs.ly"
        hint="Readonly"
        dense
        readonly
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'

const geneo_specs = reactive({
  type: 'Profil',
  desc: 'Frame 86 GENEO® with sash Z57 GENEO®',
  weight: 1500.4,
  lx: 86,
  ly: 129
})
</script>
<style></style>
