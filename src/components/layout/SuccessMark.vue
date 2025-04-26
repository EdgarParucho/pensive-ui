<script lang="ts" setup>
</script>

<template>
  <dialog class="dialog" open="true">
    <div class="experiment">
      <img class="experiment__check" src="../../assets/icons8-check-24.png"></img>
    </div>
  </dialog>
</template>

<style scoped>

.experiment {
  background-color: var(--dark);
  width: 72px;
  height: 72px;
  display: grid;
  border-radius: 50%;
  place-items: center;
  animation: roundup;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
}

.experiment__check {
  width: 24px;
  animation: fade;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
}

@keyframes roundup {
  0% {
    box-shadow: none;
  }
  100% {
    box-shadow: 0 0 16px cyan;
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

</style>