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
const Crud = useCrud({ service: service.article }, (app) => {
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
      prop: "title",
      label: "标题",
      minWidth: 150
    },
    {
     prop: "slug",
     label: "标识",
     minWidth: 150
    },
    {
      prop: "status",
      label: "状态",
      minWidth: 120,
      component: {
        name: "cl-switch"
      }
    },
    {
      prop: "updatedAt",
      label: "更新时间",
      sortable: "custom",
      minWidth: 160
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
    width: "800px"
  },
  items: [
    {
      prop: "title",
      label: "标题",
      span: 12,
      required: true,
      component: {
        name: "el-input"
      }
    },
    {
      prop: "slug",
      label: "标识",
      span: 12,
      component: {
        name: "el-input"
      }
    },
    {
      prop: "categoryId",
      label: "目录",
      span: 12,
      component: {
        name: "el-select",
        props: {
          clearable: true
        }
      }
    },
    {
      prop: "tagIdList",
      label: "标签",
      span: 12,
      component: {
        name: "el-select",
        props: {
          multiple: true,
          "multiple-limit": 3,
          clearable: true
        }
      }
    },
    {
      prop: "content",
      label: "内容",
      component: {
        name: "el-input",
        props: {
          type: "textarea",
          rows: 4
        }
      }
    },
    {
      prop: "status",
      label: "状态",
      value: true,
      component: {
        name: "el-radio-group",
        options: [
          {
            label: "开启",
            value: true
          },
          {
            label: "关闭",
            value: false
          }
        ]
      }
    }
  ],

  async onOpen(isEdit) {
    const categoryList = await service.category.list();
    const tagList = await service.tag.list();

    // 设置目录列表
		Upsert.value?.setOptions(
			"categoryId",
			categoryList.map((e) => {
				return {
					label: e.name || "",
					value: e.id
				};
			})
		);

    // 设置标签列表
    Upsert.value?.setOptions(
      "tagIdList",
      tagList.map((e) => {
        return {
          label: e.name || "",
          value: e.id
        };
      })
    );
  }
});

</script>
