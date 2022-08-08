<template>
  <md-editor
    theme="light"
    v-model="text"
    preview-theme="github"
    code-theme="atom"
    @on-change="onChange"
    @on-upload-img="onUploadImg"
  />
</template>

<script>
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { defineComponent, ref, watch } from "vue";
import { useCool } from "/@/cool";

export default defineComponent({
  name: "cl-md-editor",
  components: {
    MdEditor
  },
  props: {
    modelValue: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const { service } = useCool();

    // 文本内容
    const text = ref("");

    watch(
      () => props.modelValue,
      (val) => {
        text.value = val;
      },
      {
        immediate: true
      }
    )

    // 值改变
    function onChange(v) {
      emit("update:modelValue", v);
      emit("change", v);
    }

    // 图片上传
    async function onUploadImg(files, cb) {
      const res = await Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const fd = new FormData();
            fd.append("file", file);

            service.comm
              .upload(fd)
              .then((res) => resolve(res))
              .catch((err) => reject(err))
          });
        })
      );

      cb(res);
    }

    return {
      text,
      onChange,
      onUploadImg
    };
  }
});
</script>

<style lang="scss">
.md {
  &-toolbar-wrapper {
    &::-webkit-scrollbar {
      height: 4px !important;
    }
  }
}
</style>