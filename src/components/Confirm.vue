<script setup lang="ts">

const emit = defineEmits(['on-confirm', 'on-cancel'])

defineProps<{
  title: String,
  message: String
}>()

</script>

<template>
  <div role="alert" class="alert">
    <h3 class="alert__title">{{ title }}</h3>
    <p class="alert__message">{{ message }}</p>
    <button
    type="button"
    class="button
    button_secondary"
    @click="emit('on-cancel')"
    >Cancel</button>
    <button
    type="button"
    class="button"
    @click="emit('on-confirm')">Confirm</button>
  </div>
</template>

<style scoped>
</style>