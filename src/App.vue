<script setup lang="ts">
import { ref, provide } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Note from './models/Note.ts'
import LoginView from './components/LoginView.vue'
import NoteForm from './components/NoteForm.vue'
import SearchForm from './components/SearchForm.vue'
import SettingsMenu from './components/SettingsMenu.vue'
import PasswordForm from './components/PasswordForm.vue'
import DeleteAccount from './components/DeleteAccount.vue'
import ActionButtons from './components/ActionButtons.vue'
import NoteList from './components/NoteList.vue'

const { isAuthenticated } = useAuth0()

const notes = ref<Note[]>([])
const selectedNote = ref<Note | null>(null)

const showingDialog = ref(false)
const dialogChild = ref('')
const dialogChilds = {
  NoteForm,
  SearchForm,
  SettingsMenu,
  PasswordForm,
  DeleteAccount
}

function showDialog(child: string) {
  dialogChild.value = child
  showingDialog.value = true
}

function dismissDialog() {
  showingDialog.value = false
  selectedNote.value = null
  dialogChild.value = ''
}

function setNotes({ data }: { data: Note[] }) {
  notes.value = data
}

function updateNote(note: Note) {
  const updatedIndex = notes.value.findIndex(n => n.id == note.id)
  notes.value.splice(updatedIndex, 1, note)
}

function deleteNote() {
  setNotes({ data: notes.value.filter(n => n.id !== selectedNote.value!.id as string )})
}

function readNote(note: Note) {
  selectedNote.value = note
  showDialog('NoteForm')
}

provide('setNotes', setNotes)
provide('updateNote', updateNote)
provide('deleteNote', deleteNote)
provide('showDeleteAccountForm', () => showDialog('DeleteAccount'))
provide('showPasswordForm', () => showDialog('PasswordForm'))
provide('selectedNote', selectedNote)

</script>

<template>
  <main class="base-container">

    <header class="header" :class="{ 'header_blur': showingDialog }">

      <button
      v-if="isAuthenticated"
      class="button button_ml-auto button_icon button_bg-avatar"
      type="button"
      @click="showDialog('SettingsMenu')"
      >SettingsMenu</button>

      <LoginView v-if="!isAuthenticated" />

      <ActionButtons
      v-if="isAuthenticated"
      @show-query-form="showDialog('SearchForm')"
      @show-note-form="showDialog('NoteForm')" />

    </header>

    <NoteList
    v-if="isAuthenticated && !showingDialog && notes.length"
    :notes="notes"
    @read-note="(note: Note) => readNote(note)" />

    <Transition>
      <dialog
      class="dialog"
      @click.self="dismissDialog"
      :open="showingDialog"
      v-if="showingDialog">
        <component
        :is="dialogChilds[dialogChild as keyof typeof dialogChilds]"
        @dismiss-dialog="dismissDialog" />
      </dialog>
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

.header {
  transition: filter .5s;
}

.header_blur {
  filter: blur(4px);
}

.base-container {
  height: 100vh;
  width: 100vw;
  padding: 6px;
  position: absolute;
  display: grid;
  transition: filter .2s;
}

.button {
  height: 22px;
  width: 64px;
  border: 1px solid var(--dark);
  border-radius: 20px;
  display: block;
  color: var(--light);
  background-color: var(--dark);
  cursor: pointer;
  transition: box-shadow .5s;
  outline: none;
  font-size: .7rem;
}

.button:focus, .button:hover {
  box-shadow: 0 -1px 8px cyan;
}

.button_alert:focus, .button_alert:hover {
  box-shadow: 0 -1px 8px #Cf0f0f;
}

.button:disabled {
  box-shadow: none;
  filter: grayscale(1);
  opacity: .5;
  cursor: default;
}

.button_highlight {
  box-shadow: 0 -1px 4px cyan;
}

.button_absolute {
  position: absolute;
}

.button_centered {
  left: calc(50% - 32px);
  top: calc(50% - 11px);
}

.button_mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.button_ml-auto {
  margin-left: auto;
}

.button_lg {
  width: 96px;
}

.button_dark {
  background-color: var(--darkest);
}

.button:disabled.button_pulse {
  filter: none;
  animation-name: pulse;
  animation-duration: .5s;
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

.button_rounded {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.button_icon {
  font-size: 0;
  background-repeat: no-repeat;
  background-size: 18px;
  background-position: center;
}

.button_bg-logout {
  background-image: url('./assets/icons8-logout-24.png');
}

.button_bg-search {
  background-image: url('./assets/icons8-search-24.png');
}

.button_bg-add {
  background-image: url('./assets/icons8-add-24.png');
}

.button_bg-cancel {
  background-image: url('./assets/icons8-cancel-24.png');
}

.button_bg-check {
  background-image: url('./assets/icons8-check-24.png');
}

.button_bg-edit {
  background-image: url('./assets/icons8-edit-24.png');
}

.button_bg-delete {
  background-image: url('./assets/icons8-delete-24.png');
}

.button_bg-avatar {
  background-image: url('./assets/icons8-avatar-24.png');
}

.button_bg-delete-db {
  background-image: url('./assets/icons8-delete-database-24.png');
}

.button_bg-key {
  background-image: url('./assets/icons8-key-24.png');
}

.button_bg-tags {
  background-image: url('./assets/icons8-tags-24.png');
}

.button_bg-author {
  background-image: url('./assets/icons8-whose-quest-50.png');
}

.button_bg-x {
  background-image: url('./assets/icons8-close-24.png');
}

.button_bg-eraser {
  background-image: url('./assets/icons8-eraser-24.png');
}

.button_bg-undo {
  background-image: url('./assets/icons8-undo-24.png');
}

@keyframes pulse {
  from {
    box-shadow: 0 -1px 3px cyan;
  }
  to {
    box-shadow: 0 -1px 3px var(--dark);
  }
}

.actions-panel {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 38px;
  background-color: var(--darkest);
}

.actions-panel_blur {
  filter: blur(4px)
}

.actions-panel__layer-1 {
  position: absolute;
  bottom: 0;
  height: 20px;
  width: 380px;
  left: calc(50% - 190px);
  background-color: var(--dark);
  border-radius: 16px 16px 0 0;
}

.tabs {
  position: relative;
  margin: -19px auto 0;
  height: 20px;
  padding-top: 20px;
  width: 340px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--dark);
  border-radius: 16px 16px 0 0;
}

.tabs::before {
  content: '';
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background-color: var(--darkest);
  position: absolute;
  bottom: -18px;
  left: -36px;
  z-index: 20;
}


.tabs::after {
  content: '';
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background-color: var(--darkest);
  position: absolute;
  bottom: -18px;
  right: -36px;
  z-index: 20;
}

.dialog {
  height: 100vh;
  width: 100vw;
  border: none;
  padding: 12px;
  position: absolute;
  top: 0;
  display: grid;
  place-items: center;
  background-color: transparent;
}

</style>