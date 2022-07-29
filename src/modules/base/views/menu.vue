<template>
  <div>
    <cl-dialog
      v-model="visible"
    ></cl-dialog>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { useCool } from "@/hook";

  const { service } = useCool();

  const visible = ref(true);
</script>
