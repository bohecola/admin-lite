<template>
  <div class="app-views">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.app-views {
  flex: 1;
  overflow: hidden;
  padding: 0 10px;
  margin-bottom: 10px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-radius: 3px;

  & > div {
    height: 100%;
  }
}
</style>