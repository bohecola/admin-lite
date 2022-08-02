import { reactive } from "vue";
import * as components from "./components";

import "./common";
import "./assets/index.scss";

const CRUD = {
  install(app, options = {}) {
    app.provide("__crud", options.crud);

		// 获取浏览器信息
		(function() {
			const browser = reactive({
				isMini: false,
				screen: "full"
			});

			function resize() {
				const w = document.body.clientWidth;

				if (w < 768) {
					browser.screen = "xs";
				} else if (w < 992) {
					browser.screen = "sm";
				} else if (w < 1200) {
					browser.screen = "md";
				} else if (w < 1920) {
					browser.screen = "xl";
				} else {
					browser.screen = "full";
				}

				browser.isMini = browser.screen === "xs";
			}

			window.addEventListener("resize", resize);
			resize();

			app.provide("browser", browser);
		})();

    // 设置组件
    for(const i in components) {
      app.component(components[i].name, components[i]);
    }
  }
};

export default CRUD;