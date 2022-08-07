<template>
  <div class="captcha" @click="refresh">
    <div v-if="svg" class="svg" v-html="svg"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";

const emit = defineEmits(["change"]);

const { service } = useCool();

// svg
const svg = ref("");

function refresh() {
  service.open
    .captcha({ 
      height: 40,
      width: 150
    })
    .then(({ data }) => {
      svg.value = data;
      emit("change", svg);
    })
    .catch((err) => {
      ElMessage.error(err.message);
    });
}

onMounted(() => {
  refresh();
});

defineExpose({
  refresh
});
</script>

<style lang="scss" scoped>
.captcha {
  height: 40px;
  width: 150px;
  cursor: pointer;

  .svg {
    height: 100%;
    position: relative;
  }
}
</style>