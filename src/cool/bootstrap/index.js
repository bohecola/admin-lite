import { createPinia } from "pinia";
import mitt from "mitt";
import { createModule } from "./module";
import { router } from "../router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { Loading } from "../utils";

export async function bootstrap(app) {
  // 缓存
  app.use(createPinia());

  // ui库
  app.use(ElementPlus);

  // mitt
  app.provide("mitt", mitt());

  // 路由
  app.use(router);

  // 模块
  const { eventLoop } = createModule(app);

  // 加载
  Loading.set([eventLoop()]);
}