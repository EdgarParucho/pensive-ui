<script setup lang="ts">
import { defineEmits } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const emit = defineEmits(['askConfirmationToDeleteAccount'])
const { logout } = useAuth0()

</script>

<template>
  <div class="settings-menu">
    <button
    class="button button_secondary button_ml-auto button_icon button_bg-key"
    type="button"
    >Password</button>
    <button
    class="button button_alert button_ml-auto button_icon button_bg-account-minus"
    type="button"
    @click="emit('askConfirmationToDeleteAccount')"
    >Delete account</button>
    <button
    class="button button_secondary button_ml-auto button_icon button_bg-logout"
    type="button"
    @click="() => logout()"
    >Logout</button>
  </div>
</template>

<style scoped>
.settings-menu {
  position: absolute;
  top: 40px;
  right: 7px;
  display: grid;
  gap: 10px;
}
</style>