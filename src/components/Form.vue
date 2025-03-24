<script setup lang='ts'>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import Note from '../models/Note.ts'
import Prompt from './Prompt.vue'

onMounted(() => {
  if (props.selectedNote != null) startFromPreset()
  else unlockForm()
})

const emit = defineEmits(['close-form', 'destroy'])
const props = defineProps(['selectedNote'])
const { getAccessTokenSilently } = useAuth0()

const note = ref(new Note({}))
const loading = ref(false)
const formLocked = ref(true)
const title = ref<HTMLElement | null>(null)
const fieldset = ref<HTMLElement | null>(null)
const showKeywords = ref(false)
const updating = ref(false)
const rawKeywords = ref('')
const alerting = ref(false)
const alertData = ref({ title: '', message: '', confirming: false, onConfirm: () => {} })

const keywordsValidated = computed(() => [...new Set(rawKeywords.value
  ?.toLowerCase()
  .split(',')
  .map(keyword => keyword.trim())
  .filter(keyword => keyword != ''))]
  .join(', ')
)

const invalidForm = computed(() => ['title', 'body', 'type']
  .some((mandatoryField) => !note.value[mandatoryField as keyof Note]))

const unmodified = computed(() => {
  const formValues = JSON.stringify({ ...note.value, keywords: keywordsValidated.value })
  if (props.selectedNote) delete props.selectedNote.date
  const originalValues = JSON.stringify(updating.value ? { ...props.selectedNote } : new Note({ keywords: keywordsValidated.value }))
  return formValues === originalValues
})

function startFromPreset() {
  updating.value = true
  note.value = new Note({ ...props.selectedNote })
  rawKeywords.value = note.value.keywords as string ?? ''
  formLocked.value = true
}

function focusOnTitle() {
  nextTick().then(() => title.value?.focus())
}

function setKeywords() {
  note.value.keywords = keywordsValidated.value || null
}

function showAlert(alertInfo: { title: string, message: string, confirming: boolean, onConfirm?: () => void }) {
  alertData.value = alertInfo
  alerting.value = true
}

function alertAndClose() {
  showAlert({ title: 'Done', message: 'Record saved successfully.', confirming: false })
  setTimeout(() => emit('close-form', note.value), 1250)
}

async function handleSubmit() {
  loading.value = true
  setKeywords()
  try {
    const token = await getAccessTokenSilently()
    if (updating.value) await note.value.update(token)
    else await note.value.create(token)
    alertAndClose()
  } catch (error) {
    showAlert({ title: 'Attention', message: 'An error occurred. Please try again later.', confirming: false })
  } finally {
    loading.value = false
  }
}

async function destroy() {
  const token = await getAccessTokenSilently()
  note.value.destroy(token)
    .then(() => emit('destroy'))
    .catch(() => {showAlert({
      title: 'Attention',
      message: 'An error occurred. Please try again later.',
      confirming: false
    })})
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
  <form class="form" :class="{ 'form_blur': alerting }" @submit.prevent="handleSubmit">
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
          class="form__input form__input_border-bottom form__input_w-50 form__input_hint"
          type="text"
          placeholder="programming, self-development, health"
          autocomplete="off"
          v-model.trim="rawKeywords">

          <div class="hint">
            <span class="hint__action" @mouseenter="showKeywords = true" @mouseleave="showKeywords = false">Keywords</span>
            <div v-show="showKeywords && keywordsValidated" class="hint__text">
              <span v-for="keyword, i in keywordsValidated.split(',')" :key="i" class="keyword">{{ keyword }}</span>
            </div>
          </div>

        </div>
      </Transition>

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

    </fieldset>

  </form>

  <Transition>
    <div class="actions-panel" v-if="!alerting">
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
          :class="{ 'button_pulse': loading }"
          type="button"
          @click="handleSubmit"
          :disabled="loading || invalidForm || (updating && unmodified)"
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

</template>

<style scoped>

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
  width: 300px;
  border: 1px solid var(--neutral);
  padding: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  position: absolute;
  top: 28px;
  right: -8px;
  background-color: var(--dark);
}

.keyword {
  padding: 0 6px;
  font-size: .8rem;
  font-size: .6rem;
  color: var(--light);
  background-color: var(--neutral);
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

</style>