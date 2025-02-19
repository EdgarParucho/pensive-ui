<script setup lang="ts">

const emit = defineEmits(['on-confirm', 'on-cancel'])

defineProps<{
  title: String,
  message: String
}>()

function onConfirm() {
  emit('on-confirm')
  emit('on-cancel')
}

</script>

<template>
  <div role="alert" class="confirm-box">
    <h3 class="confirm-box__title">{{ title }}</h3>
    <p class="confirm-box__message">{{ message }}</p>
    <div class="confirm-box__actions">
      <button
      type="button"
      class="button
      button_secondary"
      @click="emit('on-cancel')"
      >Cancel</button>
      <button
      type="button"
      class="button"
      @click="() => emit('on-confirm')">Confirm</button>
    </div>
  </div>
</template>

<style scoped>

.confirm-box {
  position: absolute;
  display: grid;
  background-color: var(--darkest);
  height: 140px;
  width: 280px;
  color: var(--light);
  padding: 16px 16px 0;
}

.confirm-box__message {
  font-size: .8rem;
}

.confirm-box__actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}

</style>