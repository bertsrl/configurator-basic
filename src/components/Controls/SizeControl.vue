<template>
    <div class="control-width q-pa-md"> 
        <p class="text-subtitle2">{{ props.title }}</p>
        <q-input 
            filled
            type="number" 
            v-model="size" 
            :label="props.title" 
            stack-label 
            :dense="dense" />
        <q-slider v-model="size" :min="0" :max="1" :step="0.01" color="green"/>
    </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    size: number;
  }>(),
  {
    title: ""
  }
);

import { ref, computed } from 'vue'

const dense = ref(true);

const emit = defineEmits(["update:size"]);

const size = computed<number>({
  set: (val) => emit("update:size", val),
  get: () => props.size,
});

</script>
<style lang="ts">

</style>