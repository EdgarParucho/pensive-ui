<script setup lang="ts">
import { ref } from 'vue'
import Note from '../models/Note.ts'

const note = ref(new Note())

async function handleSubmit() {
  const { error, message } = await note.value.save()
  alert(message)
  if (!error) note.value.clear()
}

</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <fieldset class="form__fieldset">
      <input id="title" class="form__input form__input_lg" type="text" placeholder="New Record" required v-model="note.title">
      <textarea id="body" class="form__textarea" placeholder="Type the content of your record here." required v-model="note.body"></textarea>
      <label class="form__label" for="type">Type</label>
      <input id="type" class="form__input form__input_border-bottom" type="text" v-model="note.type">
      <label class="form__label" for="keywords">Keywords (comma separated)</label>
      <input id="keywords" class="form__input form__input_border-bottom" type="text" placeholder="programming, self-development, health" v-model="note.keywords">
      <label class="form__label" for="reference">Reference</label>
      <input id="reference" class="form__input form__input_border-bottom" type="text" placeholder="(Optional)" v-model="note.reference">
      <button class="form__button" type="submit">Save</button>
    </fieldset>
  </form>
</template>

<style scoped>
.form {
  padding: 2px;
  border: solid 1px #AAA;
  display: grid;
  align-content: center;
  place-items: center;
}
.form__fieldset {
  margin: 0 auto;
  padding: 4px;
  border: none;
  width: 100%;
  height: 100%;
}
.form__label {
  font-size: .7rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}
.form__input {
  width: 100%;
  margin-bottom: 1rem;
  border: none;
  outline: none;
  background-color: transparent;
}
.form__input_lg {
  font-size: 2rem;
}
.form__input_border-bottom {
  border-bottom: 1px solid  #CCC;
}
.form__input::placeholder {
  font-style: italic;
}
.form__textarea::placeholder {
  font-style: italic;
}
.form__textarea {
  width: 100%;
  height: 10rem;
  margin-bottom: 1rem;
  border: none;
  outline: none;
  background-color: transparent;
}
.form__button {
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
.form__button:disabled {
  background-color: #AAA;
  cursor: not-allowed;
}
</style>