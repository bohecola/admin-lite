<template>
  <div class="page-not-found">
    <div class="title">404</div>
    <div class="line"></div>
    <div class="next-actions">
      <span @click="router.go(-1)">返回上一层</span>
      <span @click="router.push('/')">回到首页</span>
    </div>
  </div>
</template>

<script setup>
import { useCool } from "/@/cool";

const { router } = useCool();
</script>

<style lang="scss" scoped>
  .page-not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: #f7f7f7;

    .title {
      margin-right: 20px;
      text-align: center;
      font-size: 48px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #ccc;
    }

    .line {
      height: 40px;
      width: 2px;
      background: #ccc;
    }

    .next-actions {
      margin-left: 20px;
      span {
        margin-right: 10px;
        padding: 5px 10px;
        display: inline-block;
        color: #999;
        background-color: #fff;
        border-radius: 2px;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
</style>
