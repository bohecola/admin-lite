<template>
  <div>
    <cl-dialog
      v-model="visible"
    >
    </cl-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const visible = ref(true);
</script>
