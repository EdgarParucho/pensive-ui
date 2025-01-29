<script setup lang="ts">
import { ref } from 'vue'
import Form from './components/Form.vue'
import { Read, Destroy } from './api'
import { onSuccess, onFailure } from './helpers/responses.ts'

const notes = ref([])
const setNotes = ({ data }) => notes.value = data

const read = () => Read().then(setNotes).then(onSuccess).catch(onFailure)
const destroy = (id) => Destroy(id).then(onSuccess).catch(onFailure)

</script>

<template>
  <div>
    <Form></Form>
    <ul>
      <li v-for="note in notes" :key="note.id">
        {{ note.title }}
        <button type="button" @click="destroy(note.id)">Destroy</button>
      </li>
    </ul>
    <button class="button" type="button" @click="read">Read</button>
  </div>
</template>

<style>
.button {
  margin: 0 auto;
  height: 24px;
  width: 72px;
  border: none;
  border-radius: 2px;
  display: block;
  background-color: #333;
  color: white;
  cursor: pointer;
}
.button:disabled {
  background-color: #AAA;
  cursor: not-allowed;
}
</style>