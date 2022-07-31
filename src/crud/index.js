import * as components from "./components";
import { useBase } from "/$/base";

import "./assets/index.scss";

const CRUD = {
  install(Vue, options) {
    const { app } = useBase();

    Vue.provide("app", app);

    // 设置组件
    for(const i in components) {
      Vue.component(components[i].name, components[i]);
    }
  }
};

export default CRUD;