<script setup lang="ts">
import { inject, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'
import Button from '../layout/Button.vue';

const props = defineProps(['showingDialog', 'dialogs'])
const showDialog = inject('showDialog') as (dialog: keyof typeof props.dialogs) => void
const { logout } = useAuth0()
const showingSettings = ref(false)

function onBlur() {
  setTimeout(() => showingSettings.value = false, 250)
}

</script>

<template>
  <aside class="aside" :class="{ 'aside_blur': showingDialog }">
    <Button
    text="Account Menu"
    :modifiers="['button_bg-avatar']"
    @click="showingSettings = !showingSettings"
    @keydown.esc="showingSettings = false"
    @blur="onBlur" />
    <Transition>
      <ul class="settings" v-if="showingSettings && !showingDialog">
        <li>
          <Button
          text="Update password"
          :modifiers="['button_bg-key']"
          @click="showDialog('PasswordForm')" />
        </li>
        <li>
          <Button
          text="Delete account"
          :modifiers="['button_alert', 'button_bg-delete-db']"
          @click="showDialog('DeleteAccount')" />
        </li>
        <li>
          <Button
          text="Logout"
          :modifiers="['button_bg-logout']"
          @click="logout" />
        </li>
      </ul>
    </Transition>
  </aside>
</template>

<style scoped>
.aside {
  margin-left: auto;
  position: relative;
  transition: filter .5s;
}

.aside_blur {
  filter: blur(4px);
}

.settings {
  height: 32px;
  position: absolute;
  top: 44px;
  display: grid;
  gap: 8px;
}
</style>
