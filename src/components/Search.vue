<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { Read } from '../api'
import { alertOnSuccess, alertOnFailure } from '../helpers/responses.ts'

onMounted(() => document.getElementById('search')?.focus())

const { getAccessTokenSilently } = useAuth0()
const emit = defineEmits(['set-notes', 'hide-query-form'])
const searchString = ref('')
const loading = ref(false)

const invalidQuery = computed(() => searchString.value.replace(' ', '').length < 3)

async function search() {
  if (invalidQuery.value) return
  loading.value = true
  const token = await getAccessTokenSilently()
  Read(token, searchString.value)
    .then(({ data }) => {
      const notesFound = data.length > 0
      if (notesFound) {
        alertOnSuccess()
        emit('set-notes', { data })
        emit('hide-query-form')
      } else {
        alertOnSuccess('Could not not found any notes with the given query.')
      }
    })
    .catch(alertOnFailure)
    .finally(() => loading.value = false)  
}

</script>

<template>
  <form class="form" @submit.prevent="search" @keyup.esc="() => emit('hide-query-form')">
    <label class="form__label" for="search">Search string</label>
    <input
    type="text"
    placeholder="Type here to search"
    id="search"
    class="form__input form__input_border-bottom"
    v-model.trim="searchString"
    @keypress.enter="search">
    <div class="form__actions">
      <button
      type="button"
      class="button button_secondary"
      :disabled="loading"
      @click="() => $emit('hide-query-form')"
      >Cancel</button>
      <button
      type="submit"
      class="button"
      :class="{ 'button_pulse': loading }"
      :disabled="loading || invalidQuery"
      >Search</button>
    </div>
  </form>
</template>