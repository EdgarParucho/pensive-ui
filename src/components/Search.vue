<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { Read } from '../api'
import Prompt from './Prompt.vue'
import Note from '../models/Note'

onMounted(focusOnField)

const { getAccessTokenSilently } = useAuth0()
const emit = defineEmits(['set-notes', 'hide-query-form'])
const searchString = ref('')
const loading = ref(false)
const alerting = ref(false)
const alertData = ref({ title: '', message: '' })

const invalidQuery = computed(() => searchString.value.replace(' ', '').length < 3)

function focusOnField() {
  document.getElementById('search')?.focus()
}

function showAlert(alertInfo: { title: string, message: string }) {
  alertData.value = alertInfo
  alerting.value = true
}

function dismissPrompt() {
  alerting.value = false
  focusOnField()
}

function setNotes(data: Note[]) {
  emit('set-notes', { data })
  showAlert({ title: 'Done', message: `Records found: ${data.length}` })
  setTimeout(() => emit('hide-query-form'), 1250)
}

async function search() {
  if (invalidQuery.value) return
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    const { data } = await Read(token, searchString.value)
    const notesFound = data.length > 0
    if (notesFound) setNotes(data)
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
  :class="{ 'form_blur': alerting }"
  @submit.prevent="search" @keyup.esc="() => emit('hide-query-form')">
    <label class="form__label" for="search">Search string</label>
    <input
    type="text"
    placeholder="Type here to search"
    id="search"
    class="form__input form__input_border-bottom"
    v-model.trim="searchString"
    @keypress.enter="search">
  </form>
  <Transition>
    <div class="actions-panel" v-if="!alerting">
      <div class="actions-panel__layer-1">
        <div class="tabs">
          <button
          type="button"
          class="button button_rounded button_secondary button_icon button_bg-back"
          :disabled="loading"
          @click="emit('hide-query-form')"
          >Back</button>
          <button
          type="submit"
          class="button button_rounded button_icon button_bg-search"
          :class="{ 'button_pulse': loading }"
          :disabled="loading || invalidQuery"
          >Search</button>
        </div>
      </div>
    </div>
  </Transition>
  <Transition>
    <dialog class="dialog" :open="alerting" v-if="alerting">
      <Prompt
      :title="alertData.title"
      :message="alertData.message"
      @dismiss="dismissPrompt"
      :confirming="false" />
    </dialog>
  </Transition>
</template>