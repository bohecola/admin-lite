import { defineStore } from "pinia";
import { ref } from "vue";
import { storage, deepTree } from "../utils";
import { viewer } from "../router";
import { service } from "../service";
import { orderBy } from "lodash";
import { ElMessage } from "element-plus";

// 本地缓存
const data = storage.info();

export const useMenuStore = defineStore("menu", function () {
  // 视图路由
  const routes = ref(data["viewRoutes"] || []);

  // 树形菜单
  const group = ref(data["menuGroup"] || []);

  // 左侧菜单列表
  const list = ref([]);

  // 权限列表
  const perms = ref(data["permission"] || []);

  // 设置左侧菜单
  function setMenu() {
    list.value = group.value;
  }

  // 设置权限
  function setPerms() {}

  // 设置视图
  function setRoutes(list) {
    viewer.add(list);

    routes.value = list;
    storage.set("viewRoutes", list);
  }

  // 设置树形菜单
  function setGroup(list) {
    group.value = orderBy(list, "orderNum").filter((e) => e.isShow);
    storage.set("menuGroup", group.value);
  }

  // 获取菜单、权限信息
  function get() {
    return new Promise((resolve, reject) => {
      function next(res) {
        const list = res.menus
          .filter((e) => e.type !== 2)
          .map((e) => {
            return {
              id: e.id,
              parentId: e.parentId,
              path: e.router,
              viewPath: e.viewPath,
              type: e.type,
              name: e.name,
              icon: e.icon,
              orderNum: e.orderNum,
              isShow: e.isShow === undefined ? true : e.isShow,
              meta: { label: e.name, keepAlive: e.keepAlive },
              children: []
            };
          });
        
        // 设置树形菜单
        setGroup(deepTree(list));

        // 设置视图路由
        setRoutes(list.filter((e) => e.type == 1));

        // 设置菜单
        setMenu();

        resolve(group.value);
      }

      service.comm
        .permmenu()
        .then(next)
        .catch((err) => {
          ElMessage.error("菜单加载异常!");
          reject(err);
        });
    });
  }

  return {
    routes,
    group,
    list,
    perms,
    get,
    setPerms,
    setMenu,
    setRoutes,
    setGroup
  };
});