<template>
  <div class="app-views">
    <router-view v-slot="{ Component }">
      <el-scrollbar>
        <keep-alive :include="caches">
          <component :is="Component" />
        </keep-alive>
      </el-scrollbar>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useBase } from "/$/base";

const { process } = useBase();

// 缓存列表
const caches = computed(() => {
	return process.list
		.filter((e) => e.meta?.keepAlive)
		.map((e) => {
			return e.path.substring(1, e.path.length).replace(/\//g, "-");
		});
});
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

  :deep(.el-scrollbar__view) {
    height: 100%;
  }
}
</style>
