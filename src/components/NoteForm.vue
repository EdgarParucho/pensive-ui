<script setup lang='ts'>
import { ref, computed, onMounted, inject, nextTick, type Ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Note from '../models/Note.ts'
import Prompt from './Prompt.vue'
import KeywordsForm from './KeywordsForm.vue'
import ReferenceForm from './ReferenceForm.vue'
import SuccessMark from './SuccessMark.vue'

onMounted(() => {
  if (selectedNote.value) startFromPreset()
  else unlockForm()
})

const selectedNote = inject('selectedNote') as Ref<Note>
const updateNote = inject('updateNote') as (note: Note) => void
const deleteNote = inject('deleteNote') as () => void
const emit = defineEmits(['dismiss-dialog'])
const { getAccessTokenSilently } = useAuth0()

const note = ref(new Note({ body: '', reference: null, keywords: null }))
const loading = ref(false)
const formLocked = ref(true)
const fieldset = ref<HTMLElement | null>(null)
const updating = ref(false)
const alerting = ref(false)
const alertData = ref({ title: '', message: '', confirming: false, onConfirm: () => {} })
const showingKeywordsForm = ref(false)
const showingReferenceForm = ref(false)
const showingSuccessMark = ref(false)

const invalidForm = computed(() => note.value.body.length < 5)

const unmodified = computed(() => {
  const formValues = JSON.stringify({ ...note.value })
  const originalValues = JSON.stringify(updating.value ? selectedNote.value : new Note({})) 
  return formValues === originalValues
})

function startFromPreset() {
  updating.value = true
  formLocked.value = true
  note.value = new Note({ ...selectedNote.value })
}

function showSuccessMark() {
  showingSuccessMark.value = true
  setTimeout(() => emit('dismiss-dialog'), 1500)
}

function focusOnField() {
  nextTick(() => document.getElementById('body')?.focus())
}

function setKeywords(keywords: string) {
  note.value.keywords = keywords || null
  showingKeywordsForm.value = false
}

function setReference(reference: string) {
  note.value.reference = reference || null
  showingReferenceForm.value = false
}

function showAlert(alertInfo: { title: string, message: string, confirming: boolean, onConfirm: () => void }) {
  alertData.value = alertInfo
  alerting.value = true
}

function getModifiedAttributes(note: Partial<Note>) {
  if (note.body === selectedNote.value.body) delete note.body
  if (note.keywords === selectedNote.value.keywords) delete note.keywords
  if (note.reference === selectedNote.value.reference) delete note.reference
  delete note.date
  return note
}

async function handleSubmit() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    if (updating.value) {
      await note.value.update(token, getModifiedAttributes({ ...note.value }))
      updateNote(note.value)
    } else {
      await note.value.create(token)
    }
    showSuccessMark()
  } catch (error) {
    showAlert({ title: 'Attention', message: 'An error occurred. Please try again later.', confirming: false, onConfirm: () => {} })
  } finally {
    loading.value = false
  }
}

async function destroy() {
  try {
    const token = await getAccessTokenSilently()
    await note.value.destroy(token)
    deleteNote()
    alerting.value = false
    showSuccessMark()
  } catch (__) {
    alerting.value = false
    nextTick().then(() => showAlert({
      title: 'Attention',
      message: 'An error occurred. Please try again later.',
      confirming: false,
      onConfirm: () => {}
    }))
  }
}

function unlockForm() {
  formLocked.value = false
  focusOnField()
}

function onDelete() {
  showAlert({
    title: 'Delete permanently?',
    message: 'Please confirm to proceed.',
    confirming: true,
    onConfirm: () => destroy()
  })
}

function closeForm() {
  if (unmodified.value) emit('dismiss-dialog')
  else showAlert({
    title: 'Discard changes?',
    message: 'Please confirm to proceed.',
    confirming: true,
    onConfirm: () =>  emit('dismiss-dialog')
  })
}

</script>

<template>
  <form
  class="form"
  :class="{ 'form_blur': alerting || showingSuccessMark || showingKeywordsForm || showingReferenceForm }"
  @submit.prevent="handleSubmit">
    <fieldset class="form__fieldset" ref="fieldset">

      <div class="text-container">
        <textarea
        id="body"
        class="form__textarea"
        :placeholder="`# Title\n\nThe body of the note...`"
        required
        autocomplete="off"
        v-model.trim="note.body"
        :disabled="loading || formLocked"></textarea>
      </div>

    </fieldset>
    <div class="detail-buttons">
      <button
      class="button button_dark button_rounded button_icon button_bg-tags"
      type="button"
      @click="showingKeywordsForm = true"
      >Add keywords</button>
      <button
      class="button button_dark button_rounded button_icon button_bg-author"
      type="button"
      @click="showingReferenceForm = true"
      >Add reference</button>
    </div>

  </form>


  <Transition>
    <div
    class="actions-panel"
    :class="{ 'actions-panel_blur': alerting || showingSuccessMark || showingKeywordsForm || showingReferenceForm }">
      <div class="actions-panel__layer-1">
        <div class="tabs">
          <button
          class="button button_rounded button_icon button_bg-cancel"
          type="button"
          @click="closeForm"
          >Back</button>
          <button
          v-show="!formLocked"
          class="button button_rounded button_icon button_bg-check"
          type="button"
          :disabled="loading || invalidForm || (updating && unmodified)"
          :class="{ 'button_pulse': loading, 'button_highlight': !invalidForm && !unmodified }"
          @click="handleSubmit"
          >Save</button>
          <button
          v-if="formLocked"
          class="button button_rounded button_icon button_bg-edit"
          type="button"
          @click="unlockForm"
          >Update</button>
          <button
          v-if="selectedNote"
          class="button button_alert button_rounded button_icon button_bg-delete"
          type="button"
          @click="onDelete"
          :disabled="loading"
          >Delete</button>
        </div>
      </div>
    </div>
  </Transition>

  <Transition>
    <dialog class="dialog" :open="alerting" v-if="alerting">
      <Prompt
      :title="alertData.title"
      :message="alertData.message"
      @dismiss="alerting = false"
      @confirm="alertData.onConfirm"
      :confirming="alertData.confirming" />
    </dialog>
  </Transition>

  <Transition>
    <dialog class="dialog" :open="showingKeywordsForm" v-if="showingKeywordsForm">
      <KeywordsForm
      :form-locked="formLocked"
      :keywords="note.keywords"
      @set-keywords="setKeywords"
      @dismiss="showingKeywordsForm = false" />
    </dialog>
  </Transition>
  <Transition>
    <dialog class="dialog" :open="showingReferenceForm" v-if="showingReferenceForm">
      <ReferenceForm
      :form-locked="formLocked"
      :reference="note.reference"
      @set-reference="setReference"
      @dismiss="showingReferenceForm = false" />
    </dialog>
  </Transition>
  <SuccessMark v-if="showingSuccessMark" />

</template>

<style scoped>

.form {
  height: 90%;
  min-height: 316px;
  width: 100%;
  max-width: 540px;
  padding: 12px;
  align-self: start;
  justify-self: center;
  box-shadow: -1px -1px 4px 0 var(--neutral);
  background-color: var(--dark);
  transition: filter .5s;
}

@media screen and (min-height: 540px) {
  .form {
    margin-top: 8px;
  }
}

@media screen and (min-height: 680px) {
  .form {
    margin-top: 16px;
  }
}

.form_blur {
  filter: blur(4px);
}

.form__fieldset {
  height: 90%;
  border: none;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
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
  font-size: 1.5rem;
}

.form__input_w-25 {
  width: 25%;
}

.form__input_w-80 {
  width: 80%;
}

.form__input_border-bottom {
  border-bottom: 1px solid  var(--dark);
}

.form__input_border-bottom:focus {
  border-bottom: 1px solid  cyan;
}

.text-container {
  height: 64vh;
}

@media screen and (min-height: 485px) {
  .text-container {
    height: 72vh;
  }
}

@media screen and (min-height: 680px) {
  .text-container {
    height: 78vh;
  }
}

.form__textarea {
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
  overflow-y: scroll;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--light);
  resize: none;
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For Internet Explorer */
}

.element::-webkit-scrollbar {
  /* For Webkit browsers (Chrome, Edge, Safari) */
  display: none;
}

.detail-buttons {
  margin: 12px 0 6px;
  align-self: start;
  display: flex;
  justify-content: center;
  gap: 12px;
}

</style>