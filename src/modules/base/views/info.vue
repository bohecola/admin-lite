<template>
  <div class="view-my">
    <div class="title">基本信息</div>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" />
    </el-dialog>

    <el-form label-width="100px" :model="form" :disabled="loading">
      <el-form-item label="头像">
        <el-upload
          v-model:fileList="fileList"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="1"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="昵称">
        <el-input v-model="form.nickName" placeholder="请填写昵称" />
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :disabled="loading" @click="save">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script name="my-info" setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useStore } from "@/store";
import { useCool } from "@/hook";
import { cloneDeep } from "lodash";

const { service } = useCool();
const { user } = useStore();

const fileList = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
};

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true
};

// 表单数据
const form = reactive(cloneDeep(user.info));

// 保存状态
const loading = ref(false);

// 保存
async function save() {
  const { avatar, nickName, password } = form;

  loading.value = true;

  await service.comm
    .personUpdate({
      avatar,
      nickName,
      password
    })
    .then(() => {
      form.password = "";
      ElMessage.success("修改成功");
      user.get();
    })
    .catch((err) => {
      ElMessage.error(err.message);
    });

  loading.value = false;
}

</script>

<style lang="scss">
.view-my {
  background-color: var(--el-bg-color);
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  .el-form {
    width: 400px;
    max-width: 100%;
  }

  .title {
    margin-bottom: 30px;
    font-size: 15px;
  }
}
</style>