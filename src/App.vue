<script setup lang="ts">
import { ref, provide } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Note from './models/Note.ts'
import LoginView from './components/dashboard/LoginView.vue'
import Header from './components/dashboard/Header.vue'
import Settings from './components/account/Settings.vue'
import NoteForm from './components/note/NoteForm.vue'
import SearchForm from './components/dashboard/SearchForm.vue'
import PasswordForm from './components/account/PasswordForm.vue'
import DeleteAccount from './components/account/DeleteAccount.vue'
import NoteList from './components/dashboard/NoteList.vue'

const { isAuthenticated } = useAuth0()

const notes = ref<Note[]>([])
const selectedNote = ref<Note | null>(null)
const showingDialog = ref(false)
const dialog = ref<keyof typeof dialogs | null>(null)

const dialogs = {
  NoteForm,
  SearchForm,
  PasswordForm,
  DeleteAccount
}

function showDialog(child: keyof typeof dialogs) {
  dialog.value = child
  showingDialog.value = true
}

function dismissDialog() {
  showingDialog.value = false
  selectedNote.value = null
  dialog.value = null
}

function setNotes({ data }: { data: Note[] }) {
  notes.value = data
}

function readNote(note: Note) {
  selectedNote.value = note
  showDialog('NoteForm')
}

function updateNote(note: Note) {
  const updatedIndex = notes.value.findIndex(n => n.id == note.id)
  notes.value.splice(updatedIndex, 1, note)
}

function deleteNote() {
  setNotes({ data: notes.value.filter(n => n.id !== selectedNote.value!.id as string )})
}

provide('setNotes', setNotes)
provide('updateNote', updateNote)
provide('deleteNote', deleteNote)
provide('selectedNote', selectedNote)
provide('showDialog', showDialog)

</script>

<template>
  <main class="main">

    <Settings :showing-dialog="showingDialog" :dialogs="dialogs" v-if="isAuthenticated" />

    <Header :showing-dialog="showingDialog" :dialogs="dialogs" v-if="isAuthenticated" />

    <LoginView v-else />

    <NoteList
    v-if="isAuthenticated && !showingDialog && notes.length"
    :notes="notes"
    @read-note="(note: Note) => readNote(note)" />

    <Transition>
      <dialog class="dialog" open="true" @click.self="dismissDialog" v-if="showingDialog && dialog">
        <component :is="dialogs[dialog]" @dismiss-dialog="dismissDialog" />
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

.main {
  height: 100vh;
  width: 100vw;
  padding: 6px;
  position: absolute;
  display: grid;
  transition: filter .2s;
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