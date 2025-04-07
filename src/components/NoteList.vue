<script setup lang='ts'>


defineProps(['notes'])
const emit = defineEmits(['read-note'])

function noteTitle(noteBody: string) {
  return noteBody.split('\n')[0]
}

</script>

<template>
  <ul class="list">
    <li v-for="note in notes" :key="note.id" class="list__item" @click="emit('read-note', note)">
      <span class="list__item-title">{{ noteTitle(note.body) }}</span>
      <ul class="keyword-container">
        <li
        v-for="keyword in note.keywords?.split(',')"
        :key="keyword"
        class="keyword"
        >{{ keyword }}</li>
      </ul>
      <p class="date">{{ note.date }}</p>
    </li>
  </ul>
</template>

<style scoped>

.list {
  width: 100%;
}

.list__item {
  height: 72px;
  margin: 12px auto;
  width: 90%;
  max-width: 360px;
  padding: 6px;
  background-color: var(--dark);
  transition: box-shadow .5s;
  cursor: pointer;
  list-style: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list__item:hover {
  box-shadow: -1px 0 4px 0 var(--light);
}

.list__item-title {
  font-weight: bold;
}

.keyword-container {
  margin-top: 6px;
  display: flex;
  gap: 4px;
}

.keyword {
  padding: 2px 6px;
  background-color: var(--darkest);
  font-size: .7rem;
}

.date {
  text-align: right;
  margin-top: 4px;
  font-size: .7rem;
}

</style>