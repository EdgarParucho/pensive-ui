<script setup lang="ts">
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { Read, Destroy } from './api'
import { onSuccess, onFailure } from './helpers/responses.ts'
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
  Read(token).then(setNotes).then(onSuccess).catch(onFailure)
}

function destroy(id: string) {
  Destroy(id).then(onSuccess).catch(onFailure)
}

</script>

<template>
  <div>
    <Form v-show="formIsOpen"></Form>
    <ul>
      <li v-for="note in notes" :key="note.id">
        {{ note.title }}
        <button type="button" @click="destroy(note.id)">Destroy</button>
      </li>
    </ul>
    <button v-if="isAuthenticated" class="button" type="button" @click="finish">Logout</button>
    <button v-else class="button" type="button" @click="start">Start</button>
    <button v-if="isAuthenticated" class="button" type="button" @click="read">Read</button>
    <button v-if="isAuthenticated" class="button" type="button" @click="formIsOpen = true">Add</button>
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