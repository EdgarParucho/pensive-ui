<template>
  <div class="dialog">
    <slot></slot>
  </div>
</template>

<style scoped>

.dialog {
  min-height: 140px;
  width: 100%;
  max-width: 700px;
  padding: 32px 12px 0;
  position: absolute;
  top: 100px;
  justify-self: center;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 6px 2px var(--dark);
}

</style>