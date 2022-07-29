import { ElMessage } from "element-plus";
import { 
  createRouter,
  createWebHistory,
} from "vue-router";
import { cloneDeep, isArray } from "lodash";
import { hideLoading } from "../utils";

// 视图文件
const files = import.meta.globEager("/src/**/views/**/*.vue");

// 默认路由
const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "/",
        name: "数据统计",
        component: () => import("@/views/home/index.vue")
      },
      {
        path: "/my/info",
        name: "个人中心",
        component: () => import("@/modules/base/views/info.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue")
  }
];

// 创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 组件加载后
router.beforeResolve(() => {
  hideLoading();
});

// 自定义
router.href = function (path) {
	const url = import.meta.env.BASE_URL + path;

	if (url != location.pathname) {
		location.href = url;
	}
};

let lock = false;

// 错误监听
router.onError((err) => {
	if (!lock) {
		lock = true;

		ElMessage.error("页面不存在或者未配置！");
		console.error(err);

		setTimeout(() => {
			lock = false;
		}, 0);
	}
});

// 视图
const viewer = {
  add(data) {
    // 列表
    const list = isArray(data) ? data : [data];

    list.forEach((e) => {
      const d = cloneDeep(e);

      // 命名
      d.name = d.router;

      if (!d.component) {
        const url = d.viewPath;

        if (url) {
          if (
            /^(http[s]?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.test(
							url
						)
          ) {
            d.meta.iframeUrl = url;
            d.component = () => Promise.resolve(`@/pages/iframe/index.vue`);
          } else {
            d.component = () => Promise.resolve(files["/src/" + url]);
          }
        } else {
          d.redirect = "/404";
        }
      }

      // 批量添加
      router.addRoute("index", d);
    });
  },

  get() {
    return router.getRoutes().find((e) => e.name == 'index')?.children;
  }
};

export { router, viewer };
