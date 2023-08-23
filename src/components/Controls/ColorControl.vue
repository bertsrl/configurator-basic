<style>
.picker {
  flex-wrap: wrap !important;
  height: auto;
}

.picker > div  {
  height: 25px;
  width: 25px;
  padding: 30px;
  margin: 15px;
}
</style>

<template>
    <q-btn-toggle
    v-model="selectedColor"
    toggle-color="positive"
    class="picker"
    flat
    :options="[]"
    >
    <div v-for="option in props.options" :key="option.value">
        <q-btn 
        :color="option.value"
        @click="selectedColor = option.value"
        />
        <p>{{ option.label }}</p>
    </div>
    </q-btn-toggle>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color_value: string,
    options: { value: string; label: string }[];
  }>(),
  {
    color_value: ''
  }
);

import { ref, computed } from 'vue'

const emit = defineEmits(["update:color_value"]);

const selectedColor = computed<string>({
  set: (val) => emit("update:color_value", val),
  get: () => props.color_value,
});

</script>