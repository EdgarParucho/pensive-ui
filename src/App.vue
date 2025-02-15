<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { Destroy } from './api'
import { alertOnSuccess, alertOnFailure } from './helpers/responses.ts'
import Note from './models/Note.ts'
import Form from './components/Form.vue'
import Dialog from './components/Dialog.vue'
import Search from './components/Search.vue'
import Authenticator from './components/Authenticator.vue'
import Menu from './components/Menu.vue'
import Notes from './components/Notes.vue'

const { isAuthenticated, getAccessTokenSilently } = useAuth0()

const notes = ref<Note[]>([])
const showingNoteForm = ref(false)
const showingQueryForm = ref(false)
const selectedNote = ref<Note | null>(null)

const dialogIsHidden = computed(() => {
  return !showingNoteForm.value && !showingQueryForm.value
})

function setNotes({ data }: { data: Note[] }) {
  notes.value = data
}

async function destroy(id: string) {
  const token = await getAccessTokenSilently()
  Destroy(id, token)
    .then(() => setNotes({ data: notes.value.filter(n => n.id !== id )}))
    .then(() => alertOnSuccess())
    .catch(alertOnFailure)
}

function showNoteForm(note?: Note) {
  if (note) selectedNote.value = note
  showingNoteForm.value = true
}

function hideNoteForm(note: Note | null) {
  if (selectedNote.value && note) updateNotes(note)
  selectedNote.value = null
  showingNoteForm.value = false
}

function updateNotes(note: Note) {
  const updatedIndex = notes.value.findIndex(n => n.id == note.id)
  notes.value.splice(updatedIndex, 1, note)
}


function showQueryForm() {
  showingQueryForm.value = true
}

function hideQueryForm() {
  showingQueryForm.value = false
}

</script>

<template>
  <main class="base-container">

    <Transition>
      <header v-if="dialogIsHidden">
        <Authenticator />
        <Menu
        v-if="isAuthenticated"
        @show-query-form="showQueryForm"
        @show-note-form="showNoteForm" />
      </header>
    </Transition>

    <Transition>
      <Notes
      v-if="notes.length > 0 && dialogIsHidden"
      :notes="notes"
      @destroy="destroy"
      @read-note="(note: Note) => showNoteForm(note)"/>
    </Transition>
    
    <Transition>
      <Dialog v-if="showingQueryForm">
        <Search @set-notes="setNotes" @hide-query-form="hideQueryForm" />
      </Dialog>
    </Transition>

    <Transition>
      <Dialog v-if="showingNoteForm" lg="true">
        <Form
        @close-form="hideNoteForm"
        :selected-note="selectedNote" />
      </Dialog>
    </Transition>

  </main>
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

.button {
  height: 22px;
  width: 64px;
  border: 1px solid var(--dark);
  border-radius: 2px;
  display: block;
  background-color: var(--dark);
  color: var(--light);
  cursor: pointer;
  transition: box-shadow .5s;
  outline: none;
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

.button_mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.button_ml-auto {
  margin-left: auto;
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

.form {
  height: 100%;
  position: relative;
  padding: 6px 12px 12px;
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

.form__actions {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  gap: 12px;
}

</style>