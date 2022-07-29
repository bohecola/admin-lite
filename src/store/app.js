import { defineStore } from "pinia";
import { ref } from "vue";
import { config } from "../config";
import { deepMerge, getBrowser, storage } from "../utils";

export const useAppStore = defineStore("app", function () {
  // 基本信息
  const info = ref({
    ...config.app
  });

  // 加载
  const loading = ref(false);

  // 浏览器信息
  const browser = ref(getBrowser())

  // 是否折叠
  const isFold = ref(browser.value.isMini || false);

  // 折叠
  function fold(v) {
    if (v === undefined) {
      v = !isFold.value;
    }

    isFold.value = v;
  }

  // 设置基本信息
  function set(data) {
    deepMerge(info.value, data);
    storage.set('__app__', info.value);
  }

  // 设置浏览器信息
  function setBrowser() {
    browser.value = getBrowser();
  }

  // 加载
  function showLoading() {
    loading.value = true;
  }

  // 关闭
  function hideLoading() {
    loading.value = false;
  }

  return {
    info,
    browser,
    loading,
    isFold,
    fold,
    set,
    setBrowser,
    showLoading,
    hideLoading
  };
});