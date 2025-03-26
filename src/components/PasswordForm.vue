<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"
import { Update } from "../api/account"
import Prompt from "./Prompt.vue"

onMounted(focusOnField)

const { getAccessTokenSilently } = useAuth0()
const emit = defineEmits(['close-form'])

const password = ref('')
const passwordConfirm = ref('')
const promptData = ref({
  active: false,
  title: '',
  message: '',
})

const passwordRequirements = [
  { text: 'Number', test: (value: string) => /\d/.test(value) },
  { text: 'Special character', test: (value: string) => /[!@\-#_$%^&*]/.test(value) },
  { text: 'Uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { text: 'Lowercase letters', test: (value: string) => /[a-z]/.test(value) }
]

const fieldsMatch = computed(() => password.value === passwordConfirm.value && password.value !== '')
const lengthFulfilled = computed(() => password.value.length === 8)
const invalidForm = computed(() => !fieldsMatch.value || !lengthFulfilled.value ||
  passwordRequirements.filter(requirement => requirement.test(password.value)).length < 3
)

function focusOnField() {
  document.getElementById('password')?.focus()
}

async function updatePassword() {
  try {
    const token = await getAccessTokenSilently()
    await Update({ password: password.value, token })
    promptData.value = {
      active: true,
      title: 'Done!',
      message: 'Password updated.'
    }
  } catch (__) {
    promptData.value = {
      active: true,
      title: 'An error occurred',
      message: 'Please try again later.'
    }
  }
}

</script>

<template>
  <form class="form" :class="{ 'form_blur': promptData.active }" @submit.prevent="updatePassword">
    <label class="form__label" for="password">Password</label>
    <input id="password" type="password" class="form__input form__input_border-bottom" v-model="password" placeholder="Password" maxlength="8">
    <label class="form__label" for="confirm-password">Confirm password</label>
    <input id="confirm-password" type="password" class="form__input form__input_border-bottom" v-model="passwordConfirm" placeholder="Confirm password" maxlength="8">
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
          type="submit"
          :disabled="invalidForm"
          >Confirm</button>
        </div>
      </div>
    </div>
    <div class="requirements">
      <h4 class="hint-title">
        Password requirements
      </h4>
      <ul class="list">
        <li class="list__item" :class="{ 'list__item_fulfilled': lengthFulfilled }">8 characters long.</li>
        <li class="list__item" :class="{ 'list__item_fulfilled': fieldsMatch }">Fields must match.</li>
      </ul>
      <p>At least three of the following:</p>
      <ul class="list">
        <li
        class="list__item"
        :class="{ 'list__item_fulfilled': requirement.test(password) }"
        v-for="requirement, i in passwordRequirements"
        :key="i"
        >{{ requirement.text }}</li>
      </ul>
    </div>
  </form>
  <Transition>
    <dialog class="dialog" :open="promptData.active" v-if="promptData.active">
      <Prompt
      :title="promptData.title"
      :message="promptData.message"
      @dismiss="emit('close-form')"
      :confirming="false" />
    </dialog>
  </Transition>
</template>

<style scoped>

.requirements {
  padding: 20px 0;
  margin-top: 20px;
  display: grid;
  justify-content: center;
  gap: 12px;
  color: var(--light);
}

.hint-title {
  font-size: 1.1rem;
}

.list {
  margin: 4px 0;
  align-self: start;
  color: var(--light);
}

.list__item {
  margin-top: 6px;
  list-style: '✘ ';
  transition: color 0.2s
}

.list__item_fulfilled {
  color: var(--neutral);
  list-style: '✔ ';
}

.actions-panel {
  left: 0;
}
</style>