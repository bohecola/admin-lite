<template>
  <div class="cl-upload">
    <el-upload
      ref="Upload"
      acticon=""
      class="avatar-uploader"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="httpRequest"
      :headers="headers"
      :multiple="false"
      :limit="1"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch } from "vue";
import { useCool } from "/@/cool";
import { useBase } from "/$/base";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "cl-upload-custom",
  props: {
    modelValue: {
      type: [String, Array],
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { service } = useCool();

    // 缓存
    const { user } = useBase();

    // el-upload
    const Upload = ref();

    // 图片大小限制
    const limitSize = props.limitSize || 5;

    // 图片回显
    const imageUrl = ref("");

    // 请求头
    const headers = computed(() => {
      return {
        Authorization: user.token
      };
    });
    
    // 上传前
    function beforeUpload(file, item) {
      if (file.size / 1024 / 1024 >= limitSize) {
        ElMessage.error(`上传文件大小不能超过 ${limitSize}MB!`);
        return false;
      }
      return true;
    }

    // 文件上传请求
    async function httpRequest(req) {

      const fd = new FormData();

      // 文件名
      fd.append("key", req.file.name)

      // 文件
      fd.append("file", req.file);

      service.comm
        .upload(fd)
        .then((res) => {
          imageUrl.value = res;
          update();
        })
        .catch((err) => {
          ElMessage.error(err);
        });
    }

    // 更新
    function update() {
      emit("update:modelValue", imageUrl.value)
    }

    // 获取
    watch(
      () => props.modelValue,
      (val) => {
        if (typeof val === "string") {
          imageUrl.value = val;
        }
      },
      {
        immediate: true
      }
    );

    return {
      imageUrl,
      headers,
      beforeUpload,
      httpRequest
    };
  }
});
</script>

<style lang="scss">
.cl-upload {
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 128px;
      height: 128px;
      text-align: center;
    }

    .avatar {
      width: 128px;
      height: 128px;
      display: block;
    }
  }
}
</style>