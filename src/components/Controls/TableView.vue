<template>
  <div class="q-pa-md">
    <q-table
      :ref="tableRef"
      table-header-style="lime-6"
      class="my-sticky-header-table fit"
      flat
      bordered
      title="Select a texture for the Rehau frame"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="single"
      v-model:selected="selectedTexture"
    >
      <template v-slot:body-cell-name="props">
        <!-- Use 'props.row.imageUrl' to get the image URL for each row -->
        <q-td :props="props">
          {{ props.row.name }}
        </q-td>
      </template>
      <template v-slot:body-cell-imageColumn="props">
        <!-- Use 'props.row.imageUrl' to get the image URL for each row -->
        <q-td :props="props">
          <q-avatar>
            <img :src="props.row.imageUrl" alt="Image" />
          </q-avatar>
        </q-td>
      </template>
      <template v-slot:body-cell-productionDuration="props">
        <!-- Use 'props.row.imageUrl' to get the image URL for each row -->
        <q-td :props="props">
          <p class="text-body1">{{ props.row.prodD }} days</p>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as store from '@/store'

const selectedTexture = ref()
const tableRef = ref()

watch(selectedTexture, (newVal) => {
  if (newVal[0] !== undefined) store.activeTexture.value = newVal[0]
  else {
    store.activeTexture.value = {
      name: 'Original',
      imageUrl: './textures/PVC/white.jpg',
      prodD: 30
    }
  }
})

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true
  },
  {
    name: 'imageColumn',
    label: 'Preview',
    align: 'center',
    field: 'imageUrl' // This is just a placeholder for the field, the real data is shown in the slot
  },
  {
    name: 'productionDuration',
    align: 'center',
    label: 'Production Duration',
    field: 'prodD',
    sortable: true
  }
]

const rows = [
  {
    name: 'Sheffield Oak Light F456-3081 Horschuch ',
    imageUrl: './textures/PVC/2utp8-sheffield-oak-light-stylo.jpg',
    prodD: 30
  },
  {
    name: ' Sapeli - Mahon 9.2065021-116700 Renolit ',
    imageUrl: './textures/PVC/kfpvn4-sapeli.jpg',
    prodD: 30
  }
]
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: primary

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
