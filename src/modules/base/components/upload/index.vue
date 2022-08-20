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
      <div v-if="imageUrl" class="cl-upload__actions">
        <!-- 预览 -->
        <span @click.stop="preview" v-show="imageUrl">
          <el-icon><zoom-in /></el-icon>
        </span>
        <!-- 删除 -->
        <span @click.stop="remove">
          <el-icon><delete /></el-icon>
        </span>
      </div>
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>

	<cl-dialog v-model="pv.visible" title="图片预览" width="500px">
		<img style="width: 100%" :src="pv.url" />
	</cl-dialog>
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

    // 预览
    const pv = reactive({
      visible: false,
      url: ""
    });

    // 上传前
    function beforeUpload(file, item) {
      if (file.size / 1024 / 1024 >= limitSize) {
        ElMessage.error(`上传文件大小不能超过 ${limitSize}MB!`);
        return false;
      }
      return true;
    }

    // 移除
    function remove() {
      imageUrl.value = "";
      update();
      console.log(imageUrl.value, props.modelValue, 2222);
    }

    // 预览
    function preview() {
        pv.visible = true;
        pv.url = imageUrl.value;
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
      pv,
      headers,
      beforeUpload,
      remove,
      preview,
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

      .cl-upload__actions {
        display: inline-flex;
      }
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
      object-fit: cover;
    }
  }

  &__actions {
    position: absolute;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.5);
    &.active {
      display: inline-flex;
    }

    span {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			height: 30px;
			width: 30px;
			color: #fff;
			font-size: 18px;

      &:hover {
        border-color: currentColor;
        color: var(--el-color-primary);

        .cl-upload__actions {
          display: inline-flex;
        }
      }
		}
  }
}
</style>