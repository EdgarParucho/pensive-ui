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

function unblur() {
  blur.value = false
  if (note.value.title == '') document.getElementById('title')?.focus()
  else document.getElementById('body')?.focus()
}

</script>

<template>
  <div>
    <form class="form" :class="{'form_blur': blur}" @submit.prevent="handleSubmit">
      <button
      class="button button_absolute button_right button_top"
      type="button"
      @click="emit('close-form')"
      >Close</button>
      <fieldset class="form__fieldset">
        <div class="form__section">
          <input
          id="title"
          class="form__input form__input_lg"
          type="text"
          placeholder="New Record"
          required
          v-model="note.title"
          autocomplete="off">
          <textarea
          id="body"
          class="form__textarea"
          placeholder="Type the content of your record here."
          required
          v-model="note.body"
          autocomplete="off"></textarea>
        </div>
        <div class="form__section form__section_bl">
          <label class="form__label" for="type">Type</label>
          <input
          id="type"
          class="form__input form__input_border-bottom form__input_w-25"
          type="text"
          v-model="note.type"
          autocomplete="off">
          <label class="form__label" for="keywords">Keywords (comma separated)</label>
          <input
          id="keywords"
          class="form__input form__input_border-bottom"
          type="text"
          placeholder="programming, self-development, health"
          autocomplete="off"
          v-model="note.keywords">
          <label for="reference-type" class="form__label">Reference type</label>
          <select id="reference-type" class="form__input form__input_w-25">
            <option value="none" class="form__option">None</option>
            <option value="book" class="form__option">Book</option>
            <option value="online-article" class="form__option">Online article</option>
            <option value="conference" class="form__option">Conference</option>
            <option value="audiovisual-media" class="form__option">Audiovisual media</option>
          </select>
          <label class="form__label" for="reference">Reference</label>
          <input
          id="reference"
          class="form__input form__input_border-bottom"
          type="text"
          placeholder="(Optional)"
          v-model="note.reference"
          disabled>
        </div>
      </fieldset>
      <button
      class="button button_w-50 button_ml-auto"
      :class="{'button_pulse': loading}"
      :disabled="loading"
      type="submit"
      >{{ loading ? 'Please wait' : 'Save' }}</button>
    </form>
    <div class="blur-screen" v-if="blur" @keyup.esc="unblur">
      <div>
        <input
        type="text"
        placeholder="New note"
        id="centered-field"
        class="form__input form__input_lg"
        v-model.trim="note.title"
        @keypress.enter="unblur">
        <button
        type="button"
        class="button button_mx-auto"
        @click="unblur"
        >Continue</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.form {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  padding: 32px 6px;
  background-color: var(--darkest);
}

.form_blur {
  filter: blur(2px);
}

.form__fieldset {
  border: none;
  width: 100%;
  height: 100%;
  display: flex;
}
.form__section {
  width: 100%;
  height: 100%;
  padding: 0 8px;
}

.form__section_bl {
  border-left: 1px solid var(--dark);
}

.form__section_relative {
  position: relative;
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

.form__input_lg {
  text-align: center;
  font-size: 2rem;
}

.form__input_w-25 {
  width: 25%;
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

.form__option {
  background-color: var(--dark);
}

.form__option:first-child {
  font-style: italic;
  color: var(--neutral);
}

.blur-screen {
  position: absolute;
  top: 4px;
  width: 99vw;
  height: 99vh;
  display: grid;
  place-items: center;
}

</style>