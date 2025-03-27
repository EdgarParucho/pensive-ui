<script setup lang='ts'>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Note from '../models/Note.ts'
import Prompt from './Prompt.vue'
import KeywordsForm from './KeywordsForm.vue'

onMounted(() => {
  if (props.selectedNote != null) startFromPreset()
  else unlockForm()
})

const emit = defineEmits(['close-form', 'remove-selected-note'])
const props = defineProps(['selectedNote'])
const { getAccessTokenSilently } = useAuth0()

const note = ref(new Note({}))
const loading = ref(false)
const formLocked = ref(true)
const title = ref<HTMLElement | null>(null)
const fieldset = ref<HTMLElement | null>(null)
const updating = ref(false)
const alerting = ref(false)
const alertData = ref({ title: '', message: '', confirming: false, onConfirm: () => {} })
const showingKeywordsForm = ref(false)
const showingReferenceForm = ref(false)

const invalidForm = computed(() => ['title', 'body', 'type']
  .some((mandatoryField) => !note.value[mandatoryField as keyof Note]))

const unmodified = computed(() => {
  const formValues = JSON.stringify({ ...note.value })
  if (updating.value) delete props.selectedNote.date
  const originalValues = JSON.stringify(updating.value ? { ...props.selectedNote } : new Note({}))
  return formValues === originalValues
})

function startFromPreset() {
  updating.value = true
  formLocked.value = true
  note.value = new Note({ ...props.selectedNote })
}

function focusOnTitle() {
  nextTick().then(() => title.value?.focus())
}

function setKeywords(keywords: string) {
  note.value.keywords = keywords || null
  showingKeywordsForm.value = false
}

function showAlert(alertInfo: { title: string, message: string, confirming: boolean, onConfirm: () => void }) {
  alertData.value = alertInfo
  alerting.value = true
}

function alertAndClose() {
  showAlert({ title: 'Done', message: 'Record saved successfully.', confirming: false, onConfirm: () => {} })
  setTimeout(() => emit('close-form', note.value), 1250)
}

async function handleSubmit() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    if (updating.value) await note.value.update(token)
    else await note.value.create(token)
    alertAndClose()
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
    emit('remove-selected-note')
    showAlert({
      title: 'Done',
      message: 'Record deleted successfully.',
      confirming: false,
      onConfirm: () => {}
    })
    setTimeout(() => emit('close-form'), 1250)
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
  focusOnTitle()
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
  if (unmodified.value) emit('close-form')
  else showAlert({
    title: 'Discard changes?',
    message: 'Please confirm to proceed.',
    confirming: true,
    onConfirm: () => emit('close-form')
  })
}

</script>

<template>
  <form
  class="form"
  :class="{ 'form_blur': alerting || showingKeywordsForm || showingReferenceForm }"
  @submit.prevent="handleSubmit">
    <fieldset class="form__fieldset" ref="fieldset">

      <div class="form__area">
        <input
        id="title"
        class="form__input form__input_text-lg"
        type="text"
        placeholder="New Record"
        required
        v-model.trim="note.title"
        autocomplete="off"
        ref="title"
        :disabled="loading || formLocked">
        
        <p v-show="formLocked" class="note-type">{{ note.type }}</p>
        
        <div class="text-container">
          <textarea
          id="body"
          class="form__textarea"
          placeholder="Type the content of your record here."
          required
          autocomplete="off"
          v-model.trim="note.body"
          :disabled="loading || formLocked"></textarea>
        </div>
      </div>

      <!--
      <div class="form__area form__area_sm">

        <div v-show="!formLocked || note.reference" class="note-reference" :class="{ 'note-reference_absolute': formLocked}">
          <label v-show="!formLocked" class="form__label" for="reference">Reference</label>
          <input
          id="reference"
          class="form__input form__input_border-bottom"
          type="text"
          placeholder="(Optional)"
          v-model.trim="note.reference"
          autocomplete="off"
          :disabled="loading || formLocked">
        </div>
      </div> -->

    </fieldset>
    <div class="detail-buttons">
      <button
      class="button button_dark button_rounded button_icon button_bg-tag"
      type="button"
      @click="showingKeywordsForm = true"
      >Add keywords</button>
      <button
      class="button button_dark button_rounded button_icon button_bg-link"
      type="button"
      >Add reference</button>
    </div>
    
  </form>


  <Transition>
    <div
    class="actions-panel"
    :class="{ 'actions-panel_blur': alerting || showingKeywordsForm || showingReferenceForm }">
      <div class="actions-panel__layer-1">
        <div class="tabs">
          <button
          class="button button_rounded button_icon button_bg-back"
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
          >{{ loading ? 'Loading' : 'Save' }}</button>
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
      <KeywordsForm :form-locked="formLocked" :keywords="note.keywords" @set-keywords="setKeywords" />
    </dialog>
  </Transition>

</template>

<style scoped>

.form {
  min-height: 316px;
  width: 98%;
  max-width: 540px;
  padding: 12px;
  position: relative;
  box-shadow: -1px -1px 4px 0 var(--neutral);
  background-color: var(--dark);
  transition: filter .5s;
  align-self: start;
  justify-self: center;
}

.form_blur {
  filter: blur(4px);
}

.form__fieldset {
  height: 100%;
  border: none;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
}

.form__area {
  width: 100%;
}

.divider {
  border-color: var(--neutral);
}

.form__area_sm {
  justify-self: flex-end;
  width: 25%;
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

.hint {
  position: relative;
  margin-left: 12px;
  display: inline-block;
}

.hint__action {
  margin-left: 12px;
  cursor: default;
  background-color: transparent;
  display: inline-block;
  color: transparent;
  height: 16px;
  width: 16px;
  background-image: url('../assets/icons8-eye-24.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.hint__text {
  width: 270px;
  padding: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  position: absolute;
  top: 24px;
  left: -276px;
  background-color: var(--darkest);
}

.keyword {
  padding: 0 6px;
  font-size: .8rem;
  font-size: .6rem;
  color: var(--light);
  background-color: var(--dark);
}

.note-reference {
  width: 100%;
  font-size: .8rem;
  color: var(--light);
}

.note-reference_absolute {
  position: absolute;
  bottom: 44px;
}

.note-type {
  padding: 0 6px;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: .8rem;
  border: 1px solid var(--neutral);
  border-radius: 2px;
  color: var(--light);
}

.detail-buttons {
  margin: 12px 0 6px;
  align-self: start;
  display: flex;
  justify-content: center;
  gap: 12px;
}

</style>