<script setup lang="ts">
import { onMounted } from 'vue';


const emit = defineEmits(['confirm', 'dismiss'])

const props = defineProps<{
  confirming: boolean,
  title: String,
  message: String
}>()

onMounted(() => {
  if (!props.confirming) setTimeout(() => emit('dismiss'), 1250)
})

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
    <div v-if="confirming" class="confirm-box__actions">
      <button
      type="button"
      class="button"
      @click="onDismiss"
      >Dismiss</button>
      <button
      type="button"
      class="button button_alert"
      @click="onConfirm">Confirm</button>
    </div>
  </div>
</template>

<style scoped>

.confirm-box {
  height: 140px;
  width: 280px;
  border: 1px solid var(--neutral);
  border-radius: 2px;
  padding: 16px 16px 0;
  position: absolute;
  display: grid;
  background-color: var(--darkest);
  color: var(--light);
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