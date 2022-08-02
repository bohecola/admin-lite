import { createPinia } from "pinia";
import mitt from "mitt";
import { createModule } from "./module";
import { router } from "../router";
import ElementPlus from "element-plus";
import ElIcons from "../../el-icons";
import "element-plus/dist/index.css";
import Crud from "@cool-vue/crud";
import "@cool-vue/crud/dist/index.css";
// import Crud from "../../crud";
import { Loading } from "../utils";

export async function bootstrap(app) {
  // 缓存
  app.use(createPinia());

  // ui库
  app.use(ElementPlus);

  // mitt
  app.provide("mitt", mitt());

  // icon
  app.use(ElIcons);

  // crud组件
  app.use(Crud);

  // 路由
  app.use(router);

  const { eventLoop } = createModule(app);

  // 加载
  Loading.set([eventLoop()]);
}