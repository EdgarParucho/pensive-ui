<script setup lang='ts'>
import { ref, computed, onMounted, inject } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { Read } from '../../api'
import Note from '../../models/Note'
import Prompt from '../layout/Prompt.vue'
import SuccessMark from '../layout/SuccessMark.vue'
import ActionsTab from '../layout/ActionsTab.vue'
import Button from '../layout/Button.vue';

onMounted(focusOnField)

const emit = defineEmits(['dismiss-dialog'])
const setNotes = inject('setNotes') as (payload: { data: Note[] }) => void
const { getAccessTokenSilently } = useAuth0()

const searchString = ref('')
const loading = ref(false)
const alerting = ref(false)
const alertData = ref({ title: '', message: '' })
const showingSuccessMark = ref(false)

const invalidQuery = computed(() => searchString.value.replace(' ', '').length < 3)

function showSuccessMark() {
  showingSuccessMark.value = true
  setTimeout(() => emit('dismiss-dialog'), 1500)
}

function focusOnField() {
  document.getElementById('search')?.focus()
}

function showAlert(alertInfo: { title: string, message: string }) {
  alertData.value = alertInfo
  alerting.value = true
}

function hideAlert() {
  alerting.value = false
  focusOnField()
}

function setNotesAndDismiss(data: Note[]) {
  setNotes({ data })
  showSuccessMark()
}

async function search() {
  if (invalidQuery.value) return
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    const { data } = await Read(token, searchString.value)
    const notesFound = data.length > 0
    if (notesFound) setNotesAndDismiss(data)
    else showAlert({ title: 'Attention', message: 'Nothing found with that query.' })
  } catch (__) {
    showAlert({ title: 'Attention', message: 'An error occurred. Please try again later.' })
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <form
  class="form form_sm"
  :class="{ 'form_blur': alerting || showingSuccessMark }"
  @submit.prevent="search" @keyup.esc="() => emit('dismiss-dialog')">
    <label class="form__label" for="search">Search string</label>
    <input
    id="search"
    class="form__input form__input_border-bottom"
    type="text"
    placeholder="Type here to search"
    autocomplete="off"
    v-model.trim="searchString"
    :disabled="loading"
    @keypress.enter="search">
  </form>
  <Transition>
    <ActionsTab :blur="alerting || showingSuccessMark">
      <Button
      text="Cancel"
      :modifiers="['button_bg-cancel']"
      :disabled="loading"
      @click="emit('dismiss-dialog')" />
      <Button
      text="Submit"
      :modifiers="['button_bg-check']"
      :loading="loading"
      :highlight="!invalidQuery"
      :disabled="loading || invalidQuery"
      @click="search" />
    </ActionsTab>
  </Transition>
  <Transition>
    <dialog class="dialog" :open="alerting" v-if="alerting">
      <Prompt
      :title="alertData.title"
      :message="alertData.message"
      @dismiss="hideAlert"
      :confirming="false" />
    </dialog>
  </Transition>
  <SuccessMark v-if="showingSuccessMark" />
</template>

<style scoped>

.form {
  height: 90%;
  max-height: 100px;
  width: 100%;
  max-width: 300px;
  padding: 12px;
  align-self: center;
  justify-self: center;
  box-shadow: -1px -1px 4px 0 var(--neutral);
  background-color: var(--dark);
  transition: filter .5s;
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

</style>