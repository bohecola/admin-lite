import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueSetupExtend from "vite-plugin-vue-setup-extend";


function resolve(dir) {
	return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
	base: "/",
	plugins: [
		vue(),
		vueJsx(),
		vueSetupExtend()
	],
	resolve: {
		alias: {
			"/@": resolve("src"),
			"/$": resolve("src/modules")
		},
		extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
	}
});
