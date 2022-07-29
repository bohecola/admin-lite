import { createPinia } from "pinia";
import { router, viewer } from "./router";
import { useStore } from "./store";
import ElementPlus from "element-plus";
import ElIcons from "./components/el-icons";
import "element-plus/dist/index.css";
import Crud from "@cool-vue/crud";
import "@cool-vue/crud/dist/index.css";

import "./utils/resize";

export async function bootstrap(Vue) {
  // 缓存
  Vue.use(createPinia());

  // ui库
  Vue.use(ElementPlus);

  // icon
  Vue.use(ElIcons);

  // 全局组件
  Vue.use(Crud);

  // 基础
  const { app, user, menu } = useStore();

  // 取缓存视图
  viewer.add(menu.routes);

  // 路由
  Vue.use(router);

  // 开启
  app.showLoading();

  if (user.token) {
    // 获取用户信息
    user.get();

    // 获取菜单权限
    await menu.get();
  }

  app.hideLoading();
}