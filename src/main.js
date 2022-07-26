import { createApp } from "vue";
import App from "./App.vue";
import { bootstrap } from "./cool";

const app = createApp(App);

bootstrap(app)
	.then(() => {
		app.mount("#app");
	})
	.catch((err) => {
		console.error("启动失败", err);
	});
