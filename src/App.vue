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
    class="button button_mx-auto"
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
    class="button"
    type="button"
    @click="openForm"
    >Add</button>
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
    <Transition>
      <Form v-if="formIsOpen" @close-form="closeForm" />
    </Transition>
  </div>
</template>

<style>

.v-enter-active,
.v-leave-active {
  transition: opacity .5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
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
.button_mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.button_ml-auto {
  margin-left: auto;
}
.button_w-50 {
  width: 50%;
}
.button_block {
  display: block;
  width: 100%;
}
.button_absolute {
  position: absolute;
}
.button_top {
  top: 4px;
}
.button_right {
  right: 4px;
}
.button_bottom {
  align-self: flex-end;
}
</style>