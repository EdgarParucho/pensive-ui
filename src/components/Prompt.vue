<script setup lang="ts">

const emit = defineEmits(['confirm', 'dismiss'])

defineProps<{
  confirming: boolean,
  title: String,
  message: String
}>()

function onConfirm() {
  emit('confirm')
}

function onDismiss() {
  emit('dismiss')
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
      @click="onDismiss"
      >Dismiss</button>
      <button
      v-if="confirming"
      type="button"
      class="button button_alert"
      @click="onConfirm">Confirm</button>
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
  justify-content: space-evenly;
}

</style>