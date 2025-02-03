<script setup lang="ts">
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { Read, Destroy } from './api'
import { alertOnSuccess, alertOnFailure } from './helpers/responses.ts'
import Note from './models/Note.ts'
import Form from './components/Form.vue'

const { loginWithRedirect, isAuthenticated, getAccessTokenSilently, logout } = useAuth0()

const notes = ref<Note[]>([])
const formIsOpen = ref(false)
const setNotes = ({ data }: { data: Note[] }) => notes.value = data

function start() {
  loginWithRedirect()
}

function finish() {
  logout()
}

async function read() {
  const token = await getAccessTokenSilently()
  Read(token).then(setNotes).then(alertOnSuccess).catch(alertOnFailure)
}

async function destroy(id: string) {
  const token = await getAccessTokenSilently()
  Destroy(id, token).then(alertOnSuccess).catch(alertOnFailure)
}

function openForm() {
  formIsOpen.value = true
}

function closeForm() {
  formIsOpen.value = false
}

</script>

<template>
  <div>
    <button
    v-if="isAuthenticated"
    class="button button_secondary button_ml-auto"
    type="button"
    @click="finish"
    >Logout</button>

    <button
    v-else
    class="button"
    type="button"
    @click="start"
    >Start</button>

    <button
    v-if="isAuthenticated"
    class="button"
    type="button"
    @click="read"
    >Read</button>

    <button
    v-if="isAuthenticated"
    class="button"
    type="button"
    @click="openForm"
    >Add</button>

    <Form v-show="formIsOpen" @close-form="closeForm"></Form>
    <ul>
      <li v-for="note in notes" :key="note.id">
        <span>{{ note.title }}</span>
        <button
        class="button button_secondary"
        type="button"
        @click="destroy(note.id as string)"
        >Destroy</button>
      </li>
    </ul>
  </div>
</template>

<style>
.button {
  height: 24px;
  width: 72px;
  border: none;
  border-radius: 2px;
  display: block;
  background-color: var(--dark);
  color: var(--light);
  cursor: pointer;
}
.button:disabled {
  background-color: var(--neutral);
  cursor: not-allowed;
}
.button_ml-auto {
  margin-left: auto;
}
</style>