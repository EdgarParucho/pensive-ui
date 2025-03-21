<script setup lang='ts'>
import { useAuth0 } from '@auth0/auth0-vue'

const { isLoading, loginWithRedirect, isAuthenticated, logout } = useAuth0()

</script>

<template>
  <div>
    <button
    v-if="isAuthenticated"
    class="button button_secondary button_ml-auto button_icon button_bg-logout"
    type="button"
    @click="() => logout()"
    >Logout</button>
    <div v-else>
      <div class="drop">
      </div>
      <button
      class="button button_absolute button_centered"
      type="button"
      :disabled="isLoading"
      @click="() => loginWithRedirect()"
      >Start</button>
    </div>
    <footer class="actions-panel">
      <div class="actions-panel__layer-1">
        <div class="tabs">
          <p>Edgar Parucho. (2025)</p>
          <a
          target="_blank"
          href="https://linkedin.com/in/edgarparucho"
          class="button button_rounded button_secondary button_icon button_bg-linkedin"
          >LinkedIn</a>
          <a
          target="_blank"
          href="https://edgarparucho.github.io"
          class="button button_rounded button_icon button_bg-website"
          >Website</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.drop {
  position: absolute;
  top: 15%;
  left: calc(50% - 10px);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-image: linear-gradient(360deg, var(--dark) 80%, cyan);
  animation-name: drop;
  animation-duration: 3s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
}

@keyframes drop {
  0% {
    box-shadow: -8px -2px 12px cyan;
  }
  100% {
    box-shadow: -1px -12px 16px cyan;
    transform: translateY(140px);
  }
}
</style>