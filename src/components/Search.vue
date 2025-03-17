<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { Read } from '../api'
import Prompt from './Prompt.vue'

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

function dismissPrompt() {
  alerting.value = false
  focusOnField()
}

async function search() {
  if (invalidQuery.value) return
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    const { data } = await Read(token, searchString.value)
    const notesFound = data.length > 0
    if (notesFound) {
      emit('set-notes', { data })
      showAlert({ title: 'Done', message: `Records found: ${data.length}` })
    } else {
      showAlert({ title: 'Attention', message: 'Nothing found with that query.' })
    }
  } catch (__) {
    showAlert({ title: 'Attention', message: 'An error occurred. Please try again later.' })
  } finally {
    loading.value = false
  }
}

function showAlert(alertInfo: { title: string, message: string }) {
  alertData.value = alertInfo
  alerting.value = true
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
      <div class="tabs">
        <button
        type="button"
        class="button button_rounded button_secondary"
        :disabled="loading"
        @click="emit('hide-query-form')"
        >C</button>
        <button
        type="submit"
        class="button button_rounded"
        :class="{ 'button_pulse': loading }"
        :disabled="loading || invalidQuery"
        >S</button>
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