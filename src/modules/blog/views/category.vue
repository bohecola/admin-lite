<template>
  <cl-crud ref="Crud">
    <el-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-multi-delete-btn />
      <cl-flex1 />
      <cl-search-key />
    </el-row>

    <el-row>
      <cl-table ref="Table"></cl-table>
    </el-row>

    <el-row>
      <cl-flex1 />
      <cl-pagination />
    </el-row>

    <!-- 新增、编辑 -->
    <cl-upsert ref="Upsert"></cl-upsert>
  </cl-crud>
</template>

<script setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-crud 配置
const Crud = useCrud({ service: service.category }, (app) => {
  app.refresh();
});

// cl-table 配置
const Table = useTable({
  columns: [
    {
      type: "selection",
      width: 60
    },
    {
      prop: "name",
      label: "目录名",
      minWidth: 150
    },
    {
      prop: "createdAt",
      label: "创建时间",
      sortable: "custom",
      minWidth: 160
    },
    {
      label: "操作",
      type: "op"
    }
  ]
});

// cl-upsert 配置
const Upsert = useUpsert({
  dialog: {
    width: "600px"
  },
  items: [
    {
      prop: "name",
      label: "目录名",
      span: 12,
      required: true,
      component: {
        name: "el-input"
      }
    },
    {
      prop: "slug",
      label: "URL-Slug",
      required: true,
      span: 12,
      component: {
        name: "el-input"
      }
    }
  ]
});

</script>
