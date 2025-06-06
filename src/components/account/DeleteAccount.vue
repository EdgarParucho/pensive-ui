<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"
import { Destroy } from "../../api/account"
import Prompt from "../layout/Prompt.vue"
import SuccessMark from '../layout/SuccessMark.vue'
import ActionsTab from "../layout/ActionsTab.vue"
import Button from "../layout/Button.vue"

onMounted(focusOnField)

const { getAccessTokenSilently, logout } = useAuth0()
const emit = defineEmits(['dismiss-dialog'])

const input = ref('')
const expectedInput = ref('delete my account')
const promptData = ref({
  active: false,
  title: '',
  message: '',
})
const loading = ref(false)
const showingSuccessMark = ref(false)

const invalidForm = computed(() => input.value.toLocaleLowerCase().trim() !== expectedInput.value)

function focusOnField() {
  document.getElementById('text')?.focus()
}

function showSuccessMark() {
  showingSuccessMark.value = true
  setTimeout(() => logout(), 1500)
}

async function deleteAccount() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    await Destroy(token)
    showSuccessMark()
  } catch (__) {
    promptData.value = {
      active: true,
      title: 'An error occurred',
      message: 'Please try again later.'
    }
    nextTick().then(focusOnField)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <form
  class="form form_sm"
  :class="{ 'form_blur': promptData.active || showingSuccessMark }"
  @submit.prevent="deleteAccount">
    <p>Please type <kbd class="confirmation-text">delete my account</kbd> and confirm. <br>This action is irreversible.</p>
    <label class="form__label" for="text">Confirmation field</label>
    <input
    id="text"
    type="text"
    class="form__input form__input_border-bottom"
    v-model="input"
    placeholder="delete my account"
    :disabled="loading">
  </form>
  <ActionsTab :blur="promptData.active">
    <Button
    text="Cancel"
    :modifiers="['button_bg-cancel']"
    @click="emit('dismiss-dialog')" />
    <Button
    text="Confirm"
    :modifiers="['button_bg-check']"
    :highlight="!invalidForm"
    :loading="loading"
    :disabled="invalidForm || loading"
    @click="deleteAccount" />
  </ActionsTab>
  <Transition>
    <dialog class="dialog" :open="promptData.active" v-if="promptData.active">
      <Prompt
      :title="promptData.title"
      :message="promptData.message"
      @dismiss="promptData.active = false"
      :confirming="false" />
    </dialog>
  </Transition>
  <SuccessMark v-if="showingSuccessMark" />
</template>

<style scoped>

.form {
  height: 90%;
  width: 100%;
  max-height: 200px;
  max-width: 380px;
  padding: 12px;
  margin-bottom: 32px;
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

.confirmation-text {
  padding: 1px 4px;
  border-radius: 2px;
  background: #222;
  color: #df2f2f;
}

</style>