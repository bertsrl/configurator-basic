<template>
    <div id="parent-canvas">    
        <canvas id="canvas"></canvas>   
    </div>
</template>
<script setup lang="ts">
import { loadData } from '../components/Environment/Products/LoadData'
import { ref, toRaw, watch, watchEffect, onMounted } from 'vue'

onMounted(async () => {
    const productMesh = await loadData('./models/door/correct_door_morph.gltf')

    
}),

</script>