<script setup lang='ts'>
import { useAuth0 } from '@auth0/auth0-vue'

const { isLoading, loginWithRedirect, isAuthenticated, logout } = useAuth0()

</script>

<template>
  <div>
    <button
    v-if="isAuthenticated"
    class="button button_secondary"
    type="button"
    @click="() => logout()"
    >Logout</button>
    <button
    v-else
    class="button"
    type="button"
    :disabled="isLoading"
    @click="() => loginWithRedirect()"
    >Start</button>
  </div>
</template>