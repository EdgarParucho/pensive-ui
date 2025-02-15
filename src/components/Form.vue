<script setup lang='ts'>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { alertOnSuccess, alertOnFailure } from '../helpers/responses.ts'
import Note from '../models/Note.ts'

onMounted(() => {
  if (props.selectedNote != null) startFromPreset()
  else unlockForm()
})

const emit = defineEmits(['close-form'])
const props = defineProps(['selectedNote'])
const { getAccessTokenSilently } = useAuth0()

const note = ref(new Note({}))
const loading = ref(false)
const keywordsString = ref('')
const formLocked = ref(true)
const title = ref<HTMLElement | null>(null)
const fieldset = ref<HTMLElement | null>(null)

const keywords = computed(() => [...new Set(keywordsString.value
  ?.toLowerCase()
  .split(',')
  .map(keyword => keyword.trim())
  .filter(keyword => keyword != ''))]
)

const mandatoryFields = ['title', 'body', 'type']

const invalidForm = computed(() => mandatoryFields.some((field) => !note.value[field as keyof Note]))

const updating = computed(() => props.selectedNote != null)

const updateUnmodified = computed(() => {
  if (updating.value) return false
  const formValues = { ...note.value, keywords: keywords.value }
  return JSON.stringify(formValues) === JSON.stringify(props.selectedNote)
})

function startFromPreset() {
  note.value = new Note({ ...props.selectedNote })
  keywordsString.value = note.value.keywords as string
  formLocked.value = true
}

function focusOnTitle() {
  nextTick().then(() => title.value?.focus())
}

function setKeywords() {
  note.value.keywords = keywords.value.length > 0 ? keywords.value.join(', ') : null
}

async function handleSubmit() {
  setKeywords()
  try {
    const token = await getAccessTokenSilently()
    if (updating.value) await note.value.update(token)
    else await note.value.create(token)
    alertOnSuccess()
    emit('close-form', note.value)
  } catch (error) {
    alertOnFailure(error as Error)
  }
}

function unlockForm() {
  formLocked.value = false
  focusOnTitle()
}

</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <fieldset class="form__fieldset" ref="fieldset">

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
      
      <textarea
      id="body"
      class="form__textarea"
      placeholder="Type the content of your record here."
      required
      autocomplete="off"
      v-model.trim="note.body"
      :disabled="loading || formLocked"></textarea>
      
      <Transition>
        <div v-show="!formLocked" class="transition-container">
          
          <label class="form__label" for="type">Type</label>
          <input
          type="text"
          id="type"
          class="form__input form__input_border-bottom form__input_w-25"
          v-model.trim="note.type"
          required>

          <label class="form__label" for="keywords">Keywords</label>
          <input
          id="keywords"
          class="form__input form__input_border-bottom form__input_w-50"
          type="text"
          placeholder="programming, self-development, health"
          autocomplete="off"
          v-model.trim="keywordsString">

          <label class="form__label" for="reference">Reference</label>
          <input
          id="reference"
          class="form__input form__input_border-bottom"
          type="text"
          placeholder="(Optional)"
          v-model.trim="note.reference"
          autocomplete="off"
          :disabled="loading || formLocked">
        </div>

      </Transition>
    </fieldset>
  </form>

  <div class="keyword-container">
    <span v-for="keyword, i in keywords" :key="i" class="keyword">{{ keyword }}</span>
  </div>
  <p class="note-reference" v-show="formLocked && note.reference">{{ note.reference }}</p>

  <Transition>
    <div class="form__actions">
      <button
      class="button button_secondary"
      type="button"
      @click="emit('close-form')"
      >Back</button>
      <button
      v-show="!formLocked"
      class="button"
      type="button"
      @click="handleSubmit"
      :disabled="loading || invalidForm || (updating && updateUnmodified)"
      >{{ loading ? 'Saving' : 'Save' }}</button>
      <button
      v-if="formLocked"
      class="button button_secondary"
      type="button"
      @click="unlockForm"
      >Unlock</button>
    </div>
  </Transition>

</template>

<style scoped>
.keyword-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  position: absolute;
  bottom: 72px;
}

.keyword {
  padding: 0 6px;
  border-radius: 2px;
  font-size: .8rem;
  color: var(--light);
  background-color: var(--dark);
}

.note-reference {
  font-size: .8rem;
  position: absolute;
  bottom: 44px;
}

.note-type {
  padding: 0 6px;
  position: absolute;
  top: 0;
  right: 0;
  font-size: .8rem;
  border-left: 2px solid var(--dark);
  color: var(--light);
}

</style>