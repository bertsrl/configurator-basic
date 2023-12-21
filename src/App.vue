<script setup lang="ts">
import Experience from './Views/Experience.vue'
import { onBeforeMount, onMounted } from 'vue'
import { app } from './firebase'
import { getFirestore } from 'firebase/firestore'
import * as store from '@/store'

onBeforeMount(async () => {
  store.dbRef.value = await getFirestore(app)
  await store.getControlsFromDB()

})
</script>

<template>
  <div>
    <Experience />
  </div>
</template>

<style lang="scss" scoped>
#license {
  position: absolute;
  bottom: 5vh;
  color: green !important;
}
</style>
