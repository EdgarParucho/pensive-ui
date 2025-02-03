<script setup lang='ts'>
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { alertOnSuccess, alertOnFailure } from '../helpers/responses.ts'
import Note from '../models/Note.ts'

const { getAccessTokenSilently } = useAuth0()
const emit = defineEmits(['close-form'])

const note = ref(new Note({}))

async function handleSubmit() {
  try {
    const token = await getAccessTokenSilently()
    await note.value.create(token)
    note.value.clear()
    alertOnSuccess()
  } catch (error) {
    alertOnFailure(error as Error)
  }
}

</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <button class="button button_ml-auto" type="button" @click="emit('close-form')">Close</button>
    <fieldset class="form__fieldset">
      <div class="form__area">
        <input id="title" class="form__input form__input_lg" type="text" placeholder="New Record" required v-model="note.title">
        <textarea id="body" class="form__textarea" placeholder="Type the content of your record here." required v-model="note.body"></textarea>
      </div>
      <div class="form__area">
        <label class="form__label" for="type">Type</label>
        <input id="type" class="form__input form__input_border-bottom" type="text" v-model="note.type">
        <label class="form__label" for="keywords">Keywords (comma separated)</label>
        <input id="keywords" class="form__input form__input_border-bottom" type="text" placeholder="programming, self-development, health" v-model="note.keywords">
        <label class="form__label" for="reference">Reference</label>
        <input id="reference" class="form__input form__input_border-bottom" type="text" placeholder="(Optional)" v-model="note.reference">
        <button class="button" type="submit">Save</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
.form {
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100vw;
}
.form__fieldset {
  border: none;
  width: 100%;
  display: flex;
}
.form__area {
  width: 100%;
  display: grid;
  background-color: darkslategray;
}
.form__label {
  font-size: .7rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  color: var(--lightest);
}
.form__input {
  width: 100%;
  margin-bottom: 1rem;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--light);
}
.form__input_lg {
  font-size: 2rem;
}
.form__input_border-bottom {
  border-bottom: 1px solid  #CCC;
}
.form__input::placeholder {
  font-style: italic;
  color: var(--neutral);
}
.form__textarea {
  width: 100%;
  height: 10rem;
  margin-bottom: 1rem;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--light);
  resize: none;
}
.form__textarea::placeholder {
  font-style: italic;
  color: var(--neutral);
}
</style>