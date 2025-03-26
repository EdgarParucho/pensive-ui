<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"
import { Destroy } from "../api/account"
import Prompt from "./Prompt.vue"

onMounted(focusOnField)

const { getAccessTokenSilently, logout } = useAuth0()
const emit = defineEmits(['close-form'])

const input = ref('')
const expectedInput = ref('delete my account')
const promptData = ref({
  active: false,
  title: '',
  message: '',
})
const loading = ref(false)

const invalidForm = computed(() => input.value.toLocaleLowerCase().trim() !== expectedInput.value)

function focusOnField() {
  document.getElementById('text')?.focus()
}

async function deleteAccount() {
  loading.value = true
  try {
    const token = await getAccessTokenSilently()
    await Destroy(token)
    promptData.value = {
      active: true,
      title: 'Done',
      message: 'Account deleted.'
    }
  } catch (__) {
    promptData.value = {
      active: true,
      title: 'An error occurred',
      message: 'Please try again later.'
    }
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <form class="form form_sm" :class="{ 'form_blur': promptData.active }" @submit.prevent="deleteAccount">
    <p>Please type <kbd class="confirmation-text">delete my account</kbd> and confirm. This action is irreversible.</p>
    <label class="form__label" for="text">Confirmation field</label>
    <input
    id="text"
    type="text"
    class="form__input form__input_border-bottom"
    v-model="input"
    placeholder="delete my account"
    :disabled="loading">
    <div v-if="!promptData.active" class="actions-panel">
      <div class="actions-panel__layer-1">
        <div class="tabs">
          <button
          class="button button_rounded button_icon button_bg-back"
          type="button"
          @click="emit('close-form')"
          >Back</button>
          <button
          class="button button_rounded button_icon button_bg-check"
          :class="{ 'button_pulse': loading }"
          type="submit"
          :disabled="invalidForm"
          >Confirm</button>
        </div>
      </div>
    </div>
  </form>
  <Transition>
    <dialog class="dialog" :open="promptData.active" v-if="promptData.active">
      <Prompt
      :title="promptData.title"
      :message="promptData.message"
      @dismiss="logout"
      :confirming="false" />
    </dialog>
  </Transition>
</template>

<style scoped>

.actions-panel {
  left: 0;
}

.confirmation-text {
  padding: 1px 4px;
  border-radius: 2px;
  background: #222;
  color: #df2f2f;
}

</style>