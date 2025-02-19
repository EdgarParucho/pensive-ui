<script setup lang='ts'>

defineProps(['notes'])
const emit = defineEmits(['read-note'])

</script>

<template>
  <ul class="list">
    <li v-for="note in notes" :key="note.id" class="list__item" @click="emit('read-note', note)">
      <span class="list__item-title">{{ note.title }}</span>
    </li>
  </ul>
</template>

<style scoped>

.list {
  margin: 0 auto;
}

.list__item {
  margin: 12px 0;
  list-style: none;
  width: 400px;
  height: 32px;
  background-color: var(--dark);
  padding: 6px;
  cursor: pointer;
  transition: box-shadow .4s;
}

.list__item:hover {
  box-shadow: -1px 0 4px 0 var(--neutral);
}

.list__item-title {
  font-weight: bold;
}
</style>