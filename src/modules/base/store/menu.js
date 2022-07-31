import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";
import { deepTree, storage } from "/@/cool/utils";
import { orderBy } from "lodash";
import { service, config } from "/@/cool";
import { revisePath } from "../utils";

// 本地缓存
const data = storage.info();

export const useMenuStore = defineStore("menu", function () {
  // 视图路由
  const routes = ref([]);

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
    routes.value = list;
  }

  // 设置菜单组
  function setGroup(list) {
    group.value = orderBy(list, "orderNum").filter((e) => e.isShow);
    storage.set("menuGroup", group.value);
  }

  // 获取菜单、权限信息
  function get() {
    return new Promise((resolve, reject) => {
      function next(res) {
        const list = res.menus
          ?.filter((e) => e.type != 2)
          .map((e) => {
            return {
              ...e,
              path: revisePath(e.router || (String(e.id))),
              isShow: e.isShow === undefined ? true : e.isShow,
              meta: { 
                label: e.name,
                keepAlive: e.keepAlive || 0
              },
              children: []
            };
          });
        
        // 设置菜单组
        setGroup(deepTree(list));

        // 设置视图路由
        setRoutes(list.filter((e) => e.type == 1));

        // 设置菜单
        setMenu();

        resolve(list);

        return list;
      }

      // 动态菜单
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