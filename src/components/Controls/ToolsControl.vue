<template>
  <div class="toolbox" style="border-radius: 50%">
    <q-list dark bordered separator class="no-border">
      <q-item clickable v-ripple>
        <q-item-section>
          <q-icon size="32px" color="primary" name="undo" />
          <q-item-label>Undo</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-icon size="32px" color="primary" name="redo" />
          <q-item-label>Redo</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="dragActive = dragActive === true ? false : true">
        <q-item-section>
          <q-item-section>
            <q-icon v-if="dragActive" size="32px" color="primary" name="pan_tool" />
            <q-icon v-else size="32px" color="primary" name="do_not_disturb_on" />
            <q-item-label>Drag</q-item-label>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-icon size="32px" color="primary" name="cameraswitch" />
          <q-item-label>Front</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-section>
            <q-icon size="32px" color="primary" name="square_foot" />
            <q-item-label>Metrics </q-item-label>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-section>
            <q-icon size="32px" color="primary" name="crop_free" />
            <q-item-label>Up</q-item-label>
          </q-item-section>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const dragActive = ref(true)
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
