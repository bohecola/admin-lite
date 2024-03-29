import { defineStore } from "pinia";
import { ref } from "vue";
import { storage } from "/@/cool/utils";
import { service, config, router } from "/@/cool";

// 本地缓存
const data = storage.info();

export const useUserStore = defineStore("user", function () {
	// 标识
	const token = ref(config.test.token || data.token);

	function setToken(data) {
		// 请求的唯一标识
		token.value = data.token;
		storage.set("token", data.token, data.expire);

		// 刷新 token 的唯一标识
		storage.set("refreshToken", data.refreshToken, data.refreshExpire);
	}

	// 刷新标识
	async function refreshToken() {
		return new Promise((resolve, reject) => {
			service.open.refreshToken({ refreshToken: storage.get("refreshToken") })
				.then((res) => {
					setToken(res);
					resolve(res.token);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	// 用户信息
	const info = ref(data.userInfo);

	// 设置用户信息
	function set(value) {
		info.value = value;
		storage.set("userInfo", value);
	}

	// 清除用户
	function clear() {
		storage.remove("userInfo");
		storage.remove("token");
		storage.remove("refreshToken");
		token.value = "";
		info.value = "";
	}

	// 退出
	async function logout() {
		clear();
		router.push("/login");
	}

	async function get() {
		return service.comm.person().then((res) => {
			set(res);
			return res;
		});
	}

	return {
		token,
		info,
		get,
		set,
		logout,
		clear,
		setToken,
		refreshToken
	};
});
