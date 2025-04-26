<script setup lang="ts">
defineProps(['text', 'disabled', 'loading', 'modifiers', 'highlight'])
const emit = defineEmits(['click'])
</script>

<template>
  <button
  type="button"
  :class="[
    modifiers ? `button ${modifiers.join(' ')}` : 'button',
    { 'button_pulse': loading, 'button_highlight': highlight }
  ]"
  :disabled="disabled"
  :title="text"
  @click="emit('click')"
  >{{ text }}</button>
</template>

<style scoped>

.button {
  height: 36px;
  width: 36px;
  border: 1px solid var(--dark);
  border-radius: 50%;
  outline: none;
  display: block;
  font-size: 0;
  color: var(--light);
  background-color: var(--dark);
  background-repeat: no-repeat;
  background-size: 20px;
  background-position: center;
  cursor: pointer;
  transition: box-shadow .5s;
}

.button_bl-rounded {
  border-radius: 20px 0 0 20px;
}

.button_br-rounded {
  border-radius: 0 20px 20px 0;
}

.button_w-48 {
  width: 48px;
}

.button_highlight {
  box-shadow: 0 -1px 4px cyan;
}

.button:focus, .button:hover {
  box-shadow: 0 -1px 8px cyan;
}

.button_alert:focus, .button_alert:hover {
  box-shadow: 0 -1px 8px #Cf0f0f;
}

.button:disabled {
  box-shadow: none;
  filter: grayscale(1);
  opacity: .5;
  cursor: default;
}

.button:disabled.button_pulse {
  filter: none;
  animation-name: pulse;
  animation-duration: .5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-direction: alternate;
}

@keyframes pulse {
  from {
    box-shadow: 0 -1px 3px cyan;
  }
  to {
    box-shadow: 0 -1px 3px var(--dark);
  }
}

.button_bg-logout {
  background-image: url('../../assets/icons8-logout-24.png');
}

.button_bg-search {
  background-image: url('../../assets/icons8-search-24.png');
}

.button_bg-add {
  background-image: url('../../assets/icons8-add-24.png');
}

.button_bg-cancel {
  background-image: url('../../assets/icons8-cancel-24.png');
}

.button_bg-check {
  background-image: url('../../assets/icons8-check-24.png');
}

.button_bg-edit {
  background-image: url('../../assets/icons8-edit-24.png');
}

.button_bg-delete {
  background-image: url('../../assets/icons8-delete-24.png');
}

.button_bg-avatar {
  background-image: url('../../assets/icons8-avatar-24.png');
}

.button_bg-delete-db {
  background-image: url('../../assets/icons8-delete-database-24.png');
}

.button_bg-key {
  background-image: url('../../assets/icons8-key-24.png');
}

.button_bg-tags {
  background-image: url('../../assets/icons8-tags-24.png');
}

.button_bg-author {
  background-image: url('../../assets/icons8-whose-quest-50.png');
}

.button_bg-x {
  background-image: url('../../assets/icons8-close-24.png');
}

.button_bg-eraser {
  background-image: url('../../assets/icons8-eraser-24.png');
}

.button_bg-undo {
  background-image: url('../../assets/icons8-undo-24.png');
}

.button_bg-login {
  background-image: url('../../assets/icons8-log-in-50.png');
}

</style>