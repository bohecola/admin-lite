<template>
  <div class="page-login">
    <div class="box">
      <div class="logo">
        <img src="/logo.png" alt="Logo" />
        <span>{{ app.info.name }}</span>
      </div>
      <p class="mb-5 flex items-center">
        <span class="mr-2 text-white text-sm">博客系统管理后台</span>
        <el-button
          type="success"
          size="small"
          round
          @click="isPassword = !isPassword"
        >
          {{ isPassword ? "二维码登陆" : "账号密码登陆" }}
        </el-button >
      </p>

      <el-form v-if="isPassword" label-position="top" class="form" size="large">
        <el-form-item label="用户名">
          <input
						v-model="form.username"
						placeholder="请输入用户名"
						maxlength="20"
						auto-complete="on"
            :disabled="saving"
					/>
        </el-form-item>

        <el-form-item label="密码">
          <input
						v-model="form.password"
						type="password"
						placeholder="请输入密码"
						maxlength="20"
						auto-complete="off"
            :disabled="saving"
					/>
        </el-form-item>

        <el-form-item label="验证码">
          <div class="row">
						<input
							v-model="form.verifyCode"
							placeholder="图片验证码"
							maxlength="4"
							auto-complete="off"
							@keyup.enter="toLogin"
						/>

						<captcha
							:ref="setRefs('captcha')"
							@change="
								() => {
									form.verifyCode = '';
								}
							"
						/>
					</div>
        </el-form-item>

        <div class="op">
          <el-button round :loading="saving" @click="toLogin">登陆</el-button>
        </div>
      </el-form>

      <!-- 二维码登陆 -->
      <div class="relative text-center" v-else>
        <img
          class="mb-3"
          width="200"
          height="200"
          :src="qrcode"
        >
        <qrcode-mask v-if="status === 'expired'" >
          <p class="mt-16 mb-2 text-sm">二维码已失效</p>
          <el-button
            type="success"
            size="small"
            round
            @click="getQrCode">
            刷新二维码
          </el-button>
        </qrcode-mask>

        <qrcode-mask v-if="status === 'scanned'">
          <p class="mt-16 mb-2 text-sm">已扫描<br>请在手机上确认登陆</p>
        </qrcode-mask>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import { useBase } from "/$/base";
import Captcha from "./components/captcha.vue";
import QrcodeMask from "./components/qrcode-mask.vue";

const { refs, setRefs, router, service } = useCool();
const { user, app } = useBase();

// 是否为密码登陆
const isPassword = ref(true);

// 登陆表单
const form = reactive({
	username: "",
	password: "",
	verifyCode: ""
});

// 登陆中
const saving = ref(false);

// 登陆
const toLogin = async () => {
	if (!form.username) {
		return ElMessage.error("用户名不能为空");
	}

	if (!form.password) {
		return ElMessage.error("密码不能为空");
	}

	if (!form.verifyCode) {
		return ElMessage.error("图片验证码不能为空");
	}

	saving.value = true;

	try {
		// 登录
		await service.open.login(form).then((res) => {
			user.setToken(res);
		});

		// token 事件
		await Promise.all(app.events.hasToken.map((e) => e()));

		router.push("/");
	} catch(err) {
		refs.value.captcha.refresh();
		ElMessage.error(err.message);
	}

	saving.value = false;
};

// 二维码 base64 图片字符串
const qrcode = ref("");
// 二维码 uuid
const uuid = ref("");
// 二维码状态
const status = ref("");
// 定时器
const timer = ref(null);

// 监听是否为二维码登陆
watch(isPassword, (val) => {
	// 获取二维码
	if (!val) {
		getQrCode();
	} else {
		clearTimer();
	}
});

// 获取二维码
function getQrCode() {
	service.open.qrcode().then((res) => {
		qrcode.value = res.qrcode;
		uuid.value = res.uuid;

		// 清除定时器
		clearTimer();

		// 设置二维码状态
		status.value = "pending";

		// 监听二维码状态
		timer.value = setInterval(() => {
			qrcodePoll();
		}, 2000);
	});
}

// 监听二维码状态
function qrcodePoll() {
	service.open.qrcodePoll({ uuid: uuid.value }).then(async (res) => {
		status.value = res.status;

		if(res.status === "expired") {
			clearTimer();
		}

		if (res.status === "confirmed") {
			clearTimer();
			user.setToken(res);

			// token 事件
			await Promise.all(app.events.hasToken.map((e) => e()));
			router.push("/");
		}
	});
}

// 清除定时器
function clearTimer() {
	clearInterval(timer.value);
}
</script>

<style lang="scss" scoped>
  .page-login {
    height: 100vh;
    width: 100vw;
    background-color: #2f3447;
    position: relative;

    .box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 500px;
      width: 500px;
      position: absolute;
      left: calc(50% - 250px);
      top: calc(50% - 250px);

      .logo {
        height: 50px;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        color: #fff;

        img {
          height: 50px;
        }

        span {
          font-size: 38px;
          margin-left: 10px;
          letter-spacing: 5px;
          font-weight: bold;
        }
      }

      .el-form {
        width: 300px;
        &:disabled {
          cursor: not-allowed;
        }

        :deep(.el-form-item) {
          margin-bottom: 20px;

          .el-form-item__label {
            color: #ccc;
          }
        }

        input {
          background-color: transparent;
          color: #fff;
          border: 0;
          height: 40px;
          width: calc(100% - 4px);
          margin: 0 2px;
          padding: 0 2px;
          box-sizing: border-box;
          -webkit-text-fill-color: #fff;
          font-size: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);

          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px transparent inset !important;
            transition: background-color 50000s ease-in-out 0s;
          }

          &::-webkit-input-placeholder {
            font-size: 12px;
          }

          &:focus {
            border-color: #fff;
          }

          &:disabled {
            cursor: not-allowed;
          }
        }

        .row {
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;

          .captcha {
            position: absolute;
            right: 0;
            bottom: 1px;
          }
        }
      }
      .op {
        display: flex;
        justify-content: center;
        margin-top: 50px;
        :deep(.el-button) {
          width: 140px;
        }
      }
    }
  }
</style>
