import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

function resolve(dir) {
  return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueJsx()
  ],
  resolve: {
    alias: {
      '@': resolve('src')
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
  }
})
