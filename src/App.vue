<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { Destroy } from './api/account'
import Note from './models/Note.ts'
import Form from './components/Form.vue'
import Search from './components/Search.vue'
import Authenticator from './components/Authenticator.vue'
import Settings from './components/Settings.vue'
import Password from './components/Password.vue'
import Menu from './components/Menu.vue'
import Prompt from './components/Prompt.vue'
import Notes from './components/Notes.vue'

const { isAuthenticated, getAccessTokenSilently, logout } = useAuth0()

const notes = ref<Note[]>([])
const showingNoteForm = ref(false)
const showingQueryForm = ref(false)
const selectedNote = ref<Note | null>(null)
const showingSettings = ref(false)
const showingPasswordForm = ref(false)
const promptData = ref({
  active: false,
  title: '',
  message: '',
  onConfirm: () => {},
  confirming: false
})

function toggleSettings() {
  showingSettings.value = !showingSettings.value
}

const dialogIsHidden = computed(() => !showingNoteForm.value && !showingQueryForm.value && !showingPasswordForm.value)

function setNotes({ data }: { data: Note[] }) {
  notes.value = data
}

async function destroyNote() {
  setNotes({ data: notes.value.filter(n => n.id !== selectedNote.value!.id as string )})
  showingNoteForm.value = false
  promptData.value = {
    active: true,
    title: 'Done',
    message: 'Record deleted successfully.',
    confirming: false,
    onConfirm: () => {}
  }
  setTimeout(() => hideNoteForm(), 1250)
}

function showNoteForm(note?: Note) {
  if (note) selectedNote.value = note
  showingNoteForm.value = true
}

function hideNoteForm(note?: Note) {
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

function askConfirmationToDeleteAccount() {
  promptData.value = {
    active: true,
    title: 'Delete account?',
    message: "To delete your account permanently, click 'Confirm'.",
    onConfirm: deleteAccount,
    confirming: true
  }
}

function showPasswordForm() {
  showingPasswordForm.value = true
}

async function deleteAccount() {
  try {
    const token = await getAccessTokenSilently()
    await Destroy(token)
    logout()
  } catch (error) {
    console.log(error);
    alert('Error')
  }
}

</script>

<template>
  <main class="base-container" :class="{ 'base-container_blur': promptData.active }">

    <Transition>
      <header v-if="dialogIsHidden">
        <button
        v-if="isAuthenticated"
        class="button button_secondary button_ml-auto button_icon button_bg-cog"
        type="button"
        @click="toggleSettings"
        @keyup.esc="toggleSettings"
        >Settings</button>
        <Authenticator v-else />
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
      @read-note="(note: Note) => showNoteForm(note)"/>
    </Transition>

    <Transition>
      <dialog class="dialog" :open="showingQueryForm" v-if="showingQueryForm">
        <Search @set-notes="setNotes" @hide-query-form="hideQueryForm" />
      </dialog>
    </Transition>

    <Transition>
      <dialog class="dialog" :open="showingPasswordForm" v-if="showingPasswordForm">
        <Password @close-form="showingPasswordForm = false" />
      </dialog>
    </Transition>

    <Transition>
      <Settings
      v-if="showingSettings && dialogIsHidden"
      @ask-confirmation-to-delete-account="askConfirmationToDeleteAccount"
      @show-password-form="showPasswordForm"/>
    </Transition>
    
    <Transition>
      <dialog class="dialog" :open="showingNoteForm" v-if="showingNoteForm">
        <Form
        @close-form="hideNoteForm"
        @destroy="destroyNote"
        :selected-note="selectedNote" />
      </dialog>
    </Transition>

  </main>

  <Transition>
    <dialog class="dialog" :open="promptData.active" v-if="promptData.active">
      <Prompt
      :title="promptData.title"
      :message="promptData.message"
      :confirming="promptData.confirming"
      @dismiss="promptData.active = false"
      @confirm="promptData.onConfirm" />
    </dialog>
  </Transition>

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
  transition: filter .2s;
}

.base-container_blur {
  filter: blur(4px);
}

.button {
  height: 22px;
  width: 64px;
  border: 1px solid var(--dark);
  border-radius: 2px;
  display: block;
  color: var(--light);
  background-color: var(--dark);
  cursor: pointer;
  transition: box-shadow .5s;
  outline: none;
  font-size: .7rem;
  box-shadow: 0 -1px 3px var(--neutral);
}

.button:focus, .button:hover {
  box-shadow: 0 -1px 3px cyan;
}

.button_alert:focus, .button_alert:hover {
  box-shadow: 0 -1px 3px #Cf0f0f;
}

.button:disabled {
  cursor: not-allowed;
  box-shadow: none;
  opacity: .4;
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

.button_rounded {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}

.button_icon {
  font-size: 0;
  background-repeat: no-repeat;
  background-size: 16px;
  background-position: center;
}

.button_bg-logout {
  background-image: url('./assets/icons8-logout-24.png');
}

.button_bg-search {
  background-image: url('./assets/icons8-view-24.png');
}

.button_bg-add {
  background-image: url('./assets/icons8-add-24.png');
}

.button_bg-back {
  background-image: url('./assets/icons8-back-24.png');
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

.button_bg-linkedin {
  background-image: url('./assets/icons8-linkedin-24.png');
}

.button_bg-website {
  background-image: url('./assets/icons8-website-24.png');
}

.button_bg-cog {
  background-image: url('./assets/icons8-cog-24.png');
}

.button_bg-account-minus {
  background-image: url('./assets/icons8-denied-24.png');
}

.button_bg-key {
  background-image: url('./assets/icons8-key-24.png');
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
  height: 80%;
  min-height: 316px;
  width: 96%;
  max-width: 500px;
  padding: 12px;
  position: relative;
  box-shadow: -1px -1px 4px 0 var(--neutral);
  background-color: var(--dark);
  transition: filter .5s;
}

@media screen and (max-height: 400px) {
  .form {
    align-self: start;
  }
}

.form_blur {
  filter: blur(4px);
}

.form_sm {
  min-height: 60px;
  max-height: 160px;
  max-width: 360px;
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
  margin-bottom: 1rem;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--light);
  resize: none;
}

.actions-panel {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 38px;
  background-color: var(--darkest);
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
  padding-top: 14px;
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