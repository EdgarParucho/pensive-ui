<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { alertOnSuccess, alertOnFailure } from '../helpers/responses.ts'
import Note from '../models/Note.ts'

onMounted(() => document.getElementById('centered-field')?.focus())

const { getAccessTokenSilently } = useAuth0()
const emit = defineEmits(['close-form'])

const note = ref(new Note({}))
const loading = ref(false)
const blur = ref(true)

async function handleSubmit() {
  try {
    const token = await getAccessTokenSilently()
    await note.value.create(token)
    note.value.clear()
    alertOnSuccess()
    emit('close-form')
  } catch (error) {
    alertOnFailure(error as Error)
  }
}

function removeBlur() {
  blur.value = false
  if (note.value.title == '') document.getElementById('title')?.focus()
  else document.getElementById('body')?.focus()
}

</script>

<template>
  <div class="container">
    <button
    class="button button_absolute button_right button_top"
    type="button"
    @click="emit('close-form')"
    >Close</button>
    <form class="form" :class="{'form_blur': blur}" @submit.prevent="handleSubmit">
      <fieldset class="form__fieldset">
        <input
        id="title"
        class="form__input form__input_text-lg"
        type="text"
        placeholder="New Record"
        required
        v-model="note.title">
        <textarea
        id="body"
        class="form__textarea"
        placeholder="Type the content of your record here."
        required
        v-model="note.body"></textarea>
        <label class="form__label" for="type">Type</label>
        <input
        id="type"
        class="form__input form__input_border-bottom form__input_w-25"
        type="text"
        v-model="note.type">
        <label class="form__label" for="keywords">Keywords (comma separated)</label>
        <input
        id="keywords"
        class="form__input form__input_border-bottom form__input_w-50"
        type="text"
        placeholder="programming, self-development, health"
        v-model="note.keywords">
        <label class="form__label" for="reference">Reference</label>
        <input
        id="reference"
        class="form__input form__input_border-bottom"
        type="text"
        placeholder="(Optional)"
        v-model="note.reference">
      </fieldset>
      <button
      class="button button_block button_mx-auto"
      type="submit"
      >{{ loading ? 'Please wait' : 'Save' }}</button>
    </form>
    <div class="blur-screen" v-if="blur" @keyup.esc="removeBlur">
      <input
      type="text"
      placeholder="New note"
      id="centered-field"
      class="form__input form__input_text-lg form__input_border-bottom"
      v-model.trim="note.title"
      @keypress.enter="removeBlur">
      <button
      type="button"
      class="button"
      @click="removeBlur"
      >Continue</button>
    <div class="blur-screen" v-if="blur" @keyup.esc="removeBlur">
      <input
      type="text"
      placeholder="New note"
      id="centered-field"
      class="form__input form__input_text-lg form__input_border-bottom"
      v-model.trim="note.title"
      @keypress.enter="removeBlur">
      <button
      type="button"
      class="button"
      @click="removeBlur"
      >Continue</button>
    </div>
  </div>
  </div>
</template>

<style scoped>

.container {
  height: 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: grid;
  place-items: center;
}

.form {
  display: grid;
  place-items: center;
}

.form {
  height: 100%;
  width: 100%;
  max-width: 700px;
  padding: 32px 6px;
  background-color: var(--darkest);
  transition: filter .5s;
}

.form_blur {
  filter: blur(4px);
  filter: blur(4px);
}

.form__fieldset {
  height: 100%;
  border: none;
}

.form__label {
  margin: 8px 0;
  font-size: .7rem;
  font-weight: bold;
  display: block;
  color: var(--light);
}

.form__input {
  width: 100%;
  margin-bottom: 1rem;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--light);
}

.form__input_text-lg {
  font-size: 2.5rem;
}

.form__input_w-25 {
  width: 25%;
}

.form__input_w-50 {
  width: 50%;
}

.form__input_border-bottom {
  border-bottom: 1px solid  var(--dark);
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

.form__input::placeholder, .form__textarea::placeholder {
  font-style: italic;
  color: var(--neutral);
}

.blur-screen {
  height: 100%;
  width: 100%;
  max-width: 700px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  justify-content: center;
  gap: 8px;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

</style>