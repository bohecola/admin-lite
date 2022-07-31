import { config } from "/@/cool";
import { useStore } from "./store";
import "./static/css/index.scss";

export default () => {
  return {
    order: 99,
    components: Object.values(import.meta.glob("./components/**/*")),
    views: [
      {
        path: "/my/info",
        meta: {
          label: "个人中心"
        },
        component: () => import("./views/info.vue")
      }
    ],
    pages: [
      {
        path: "/login",
        component: () => import("./pages/login/index.vue")
      },
      {
        path: "/404",
        meta: {
          process: false
        },
        component: () => import("./pages/error-page/404.vue")
      }
    ],
    install() {
      // 设置标题
      document.title = config.app.name;
    },
    async onLoad() {
      const { user, menu } = useStore();

      if (user.token) {
        // 获取用户信息
        user.get();
        // 获取菜单权限
        await menu.get();
      }

      return {
        async hasToken(cb) {
          if (user.token) {
            if (cb) await cb();
          }
        }
      };
    }
  };
};