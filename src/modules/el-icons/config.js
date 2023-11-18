import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const ElIcons = {
	install(app, options) {
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			app.component(key, component);
		}
	}
};

export default () => {
	return { install: ElIcons.install };
};
