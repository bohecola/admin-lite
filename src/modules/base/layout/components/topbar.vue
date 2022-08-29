<template>
  <div class="app-topbar">
    <div 
      :class="['app-topbar__collapse', {
        unfold: !app.isFold 
      }]"
      @click="app.fold()"
    >
      <el-icon><Fold /></el-icon>
    </div>

    <!-- 路由导航 -->
		<route-nav />

    <div class="flex1"></div>

    <div class="app-topbar__tools"></div>

    <div class="app-topbar__user">
      <el-dropdown trigger="click" :hide-on-click="false" @command="onCommand">
        <span class="el-dropdown-link">
          <span class="name">{{ user.info.nickName }}</span>
          <img class="avatar" :src="user.info.avatar" />
        </span>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="my">
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item command="exit">
              <span>退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useBase } from "/$/base";
import { useCool } from "/@/cool";
import RouteNav from "./route-nav.vue";

const { router, service } = useCool();
const { user, app } = useBase();

// 跳转
async function onCommand(name) {
  switch (name) {
    case "my":
      router.push("/my/info");
      break;
    case "exit":
      // await service.comm.logout()
      user.logout();
      break;
  }
}
</script>

<style lang="scss" scoped>
.app-topbar {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  background-color: #fff;
  margin-bottom: 10px;

  &__collapse {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    transform: rotateY(180deg);

    &.unfold {
      transform: rotateY(0)
    }

    i {
      font-size: 22px;
    }
  }

  .flex1 {
    flex: 1;
  }

  &__tools {
    display: flex;
    margin-right: 20px;

    & > li {
      display: flex;
      justify-content: center;
      align-items: center;
      list-style: none;
      height: 45px;
      width: 45px;
      border-radius: 3px;
      cursor: pointer;
      margin-left: 10px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }

  &__user {
    margin-right: 10px;
    cursor: pointer;

    .el-dropdown-link {
      display: flex;
      align-items: center;
    }

    .avatar {
      height: 32px;
      width: 32px;
      border-radius: 32px;
      object-fit: cover;
    }

    .name {
      white-space: nowrap;
      margin-right: 15px;
    }

    .el-icon-arrow-down {
      margin-left: 10px;
    }
  }
}
</style>