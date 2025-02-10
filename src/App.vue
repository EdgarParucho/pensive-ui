<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { Read, Destroy } from './api'
import { alertOnSuccess, alertOnFailure } from './helpers/responses.ts'
import Note from './models/Note.ts'
import Form from './components/Form.vue'

const { loginWithRedirect, isAuthenticated, getAccessTokenSilently, logout } = useAuth0()

const notes = ref<Note[]>([])
const showingNoteForm = ref(false)
const showingQueryForm = ref(false)
const loading = ref(false)
const queryString = ref('')

const invalidQuery = computed(() => queryString.value.replace(' ', '').length < 3)

function setNotes({ data }: { data: Note[] }) {
  notes.value = data
}

function start() {
  loginWithRedirect()
}

function finish() {
  logout()
}

async function destroy(id: string) {
  const token = await getAccessTokenSilently()
  Destroy(id, token)
    .then(() => alertOnSuccess())
    .catch(alertOnFailure)
}

function showNoteForm() {
  showingNoteForm.value = true
}

function hideNoteForm() {
  showingNoteForm.value = false
}

function openQueryForm() {
  showingQueryForm.value = true
  document.getElementById('title')?.focus()
}

function hideQueryForm() {
  showingQueryForm.value = false
}

async function makeQuery() {
  loading.value = true
  const token = await getAccessTokenSilently()
  Read(token, queryString.value)
    .then(({ data }) => {
      const notesFound = data.length > 0
      if (notesFound) {
        alertOnSuccess()
        setNotes({ data })
        hideQueryForm()
      } else {
        alertOnSuccess('Could not not found any notes with the given query.')
      }
    })
    .catch(alertOnFailure)
    .finally(() => loading.value = false)  
}

</script>

<template>
  <div class="base-container">

    <Transition>
      <div class="top-bar">
        <button
        v-if="isAuthenticated && (!showingNoteForm || !showingQueryForm)"
        class="button button_secondary"
        :class="{ 'base-container_blur': showingNoteForm || showingQueryForm }"
        :disabled="loading"
        type="button"
        @click="finish"
        >Logout</button>
        <button
        v-if="!isAuthenticated"
        class="button button_mx-auto"
        type="button"
        @click="start"
        >Start</button>
      </div>
    </Transition>

    <Transition>
      <aside v-if="isAuthenticated && !showingNoteForm && !showingQueryForm" class="app-bar">
        <button
        class="button button_bl-rounded"
        :class="{ 'button_pulse': loading }"
        :disabled="loading"
        type="button"
        @click="openQueryForm"
        >{{ loading ? 'Loading' : 'Search' }}</button>

        <button
        class="button button_br-rounded"
        type="button"
        @click="showNoteForm"
        >Add</button>
      </aside>
    </Transition>

    <Transition>
      <ul v-if="notes.length > 0 && !showingNoteForm && !showingQueryForm" class="note-list">
        <li v-for="note in notes" :key="note.id" class="note-list__item">
          <span class="note-list__title">{{ note.title }}</span>
          <button
          class="button button_secondary"
          type="button"
          @click="destroy(note.id as string)"
          >Destroy</button>
        </li>
      </ul>
    </Transition>

    <Transition>
      <div v-if="showingNoteForm" class="dialog">
        <Form @close-form="hideNoteForm" />
      </div>
    </Transition>

    <Transition>
      <div class="dialog" v-if="showingQueryForm" @keyup.esc="hideQueryForm">
        <label class="form__label" for="query">Search string</label>
        <input
        type="text"
        placeholder="Type here to search"
        id="query"
        class="form__input form__input_border-bottom"
        v-model.trim="queryString"
        @keypress.enter="makeQuery">
        <div class="dialog__actions">
          <button
          type="button"
          class="button button_secondary"
          :disabled="loading"
          @click="hideQueryForm"
          >Cancel</button>
          <button
          type="button"
          class="button"
          :class="{ 'button_pulse': loading }"
          :disabled="loading || invalidQuery"
          @click="makeQuery"
          >Search</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>

.v-enter-active,
.v-leave-active {
  transition: opacity .3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.base-container {
  height: 100vh;
  width: 100vw;
  padding: 6px;
  position: absolute;
  display: grid;
}

.base-container_blur {
  filter: blur(2px);
}

.top-bar {
  justify-self: end;
}

.dialog {
  min-height: 140px;
  width: 100%;
  max-width: 700px;
  padding: 32px 12px 0;
  position: absolute;
  top: 100px;
  justify-self: center;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 6px 2px var(--dark);
}

.dialog_v-center {
  top: calc(50% - 100px);
}

.dialog__actions {
  display: flex;
  align-self: end;
  gap: 8px;
}

.button {
  height: 22px;
  width: 64px;
  border: 1px solid var(--dark);
  border-radius: 2px;
  display: inline-block;
  background-color: var(--dark);
  color: var(--light);
  cursor: pointer;
  transition: box-shadow .5s;
  outline: none;
}

.button_align-center {
  align-self: center;
  justify-self: center;
}

.button:focus, .button:hover {
  box-shadow: 0px 0px 1px 1px var(--neutral);
}

.button:disabled {
  color: var(--neutral);
  cursor: not-allowed;
  box-shadow: none;
}

.button_secondary {
  background-color: var(--darkest);
}

.button_self-end {
  justify-self: end;
}

.button_mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.button_ml-auto {
  margin-left: auto;
}

.button_absolute {
  position: absolute;
}

.button_top-right {
  top: 4px;
  right: 4px;
}

.button_pulse {
  animation-name: pulse;
  animation-duration: .7s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-direction: alternate;
}

.button_bl-rounded {
  border-radius: 20px 0 0 20px;
}

.button_br-rounded {
  border-radius: 0 20px 20px 0;
}

@keyframes pulse {
  from {
    background-color: var(--dark);
  }
  to {
    background-color: var(--neutral);
  }
}

.app-bar {
  height: 24px;
  width: 140px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--dark);
  border-radius: 20px;
}

.note-list {
  display: grid;
  justify-content: center;
  gap: 6px;
}

.note-list__item {
  width: 300px;
  display: flex;
  justify-content: space-between;
}

.form {
  padding: 6px 12px;
  display: grid;
  place-items: center;
  gap: 8px;
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

.form__input::placeholder, .form__textarea::placeholder {
  font-style: italic;
  color: var(--neutral);
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

.form__input_border-bottom:focus {
  border-bottom: 1px solid  cyan;
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

</style>