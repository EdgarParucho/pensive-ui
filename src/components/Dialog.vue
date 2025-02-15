<script setup lang="ts">
const props = defineProps(['lg'])
</script>

<template>
  <div class="dialog" :class="{'dialog_lg': props.lg}">
    <slot></slot>
  </div>
</template>

<style scoped>

.dialog {
  height: 140px;
  width: 100%;
  max-width: 700px;
  padding: 32px 12px 0;
  position: absolute;
  top: 100px;
  justify-self: center;
  box-shadow: 0 0 6px 2px var(--dark);
}

.dialog_lg {
  height: 80vh;
}

</style>