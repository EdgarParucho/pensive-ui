<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from './Button.vue';

const emit = defineEmits(['confirm', 'dismiss'])

const props = defineProps<{
  confirming: boolean,
  title: String,
  message: String
}>()

const loading = ref(false)

onMounted(() => {
  if (!props.confirming) setTimeout(() => emit('dismiss'), 1250)
})

function onConfirm() {
  loading.value = true
  emit('confirm')
}

function onCancel() {
  emit('dismiss')
}

</script>

<template>
  <div role="alert" class="confirm-box">
    <h3 class="confirm-box__title">{{ title }}</h3>
    <p class="confirm-box__message">{{ message }}</p>
    <div v-if="confirming" class="confirm-box__actions">
      <Button
      text="Cancel"
      :modifiers="['button_bg-cancel']"
      :disabled="loading"
      @click="onCancel" />
      <Button
      :text="loading ? 'Loading' : 'Confirm'"
      :modifiers="['button_bg-delete', 'button_alert']"
      :loading="loading"
      :disabled="loading"
      @click="onConfirm" />
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