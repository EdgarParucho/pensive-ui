<script setup lang='ts'>

defineProps(['notes'])
const emit = defineEmits(['destroy'])

function askConfirmation(id: string) {
  if (confirm('Please confirm to delete the note permanently.')) emit('destroy', id)
}
</script>

<template>
  <ul class="list">
    <li v-for="note in notes" :key="note.id" class="list__item">
      <span class="list__item-title">{{ note.title }}</span>
      <button
      class="button button_secondary"
      type="button"
      @click="askConfirmation(note.id)"
      >Delete</button>
    </li>
  </ul>
</template>

<style scoped>
.list {
  display: grid;
  justify-content: center;
  gap: 6px;
}

.list__item {
  width: 300px;
  display: flex;
  justify-content: space-between;
}
.list__item-title {
  font-weight: bold;
}
</style>