<template>
  <cl-crud ref="Crud">
    <el-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-search-key />
    </el-row>

    <el-row>
      <cl-table ref="Table" row-key="id" @row-click="onRowClick">
        <!-- 名称 -->
        <template #column-name="{ scope }">
          <span>{{ scope.row.name }}</span>
          <el-tag
            v-if="!scope.row.isShow"
            effect="dark"
            type="danger"
            disable-transitions
            style="margin-left: 10px"
          >隐藏</el-tag>
        </template>

        <!-- 图标 -->
        <template #column-icon="{ scope }">
          <el-icon size="16px" style="margin-top: 5px">
            <component :is="scope.row.icon" />
          </el-icon>
        </template>

        <!-- 权限 -->
				<template #column-perms="{ scope }">
					<el-tag
						v-for="(item, index) in scope.row.permList"
						:key="index"
						effect="plain"
						size="small"
						style="margin: 2px; letter-spacing: 0.5px"
						>{{ item }}</el-tag
					>
				</template>

        <!-- 路由 -->
        <template #column-router="{ scope }">
					<el-link v-if="scope.row.type == 1" type="success" :href="scope.row.router">{{
						scope.row.router
					}}</el-link>
					<span v-else>{{ scope.row.router }}</span>
				</template>
  
				<!-- 路由缓存 -->
				<template #column-keepAlive="{ scope }">
					<el-icon v-if="scope.row.type == 1">
						<check v-if="scope.row.keepAlive" />
						<close v-else />
					</el-icon>
					<span v-else></span>
				</template>

				<!-- 行新增 -->
				<template #slot-add="{ scope }">
					<el-button
						v-if="scope.row.type != 2"
						type="success"
						text
						bg
						@click="append(scope.row)"
						>新增</el-button
					>
				</template>
      </cl-table>
    </el-row>

    <el-row>
      <cl-flex1 />
      <cl-pagination layout="total" />
    </el-row>
  </cl-crud>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCool } from "/@/cool";
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { deepTree } from "/@/cool/utils";

const { service } = useCool();

// cl-crud 配置
const Crud = useCrud(
  {
    service: "test",
    onRefresh(_, { render }) {
      service.menu.list().then((list) => {
        list.map((e) => {
          e.permList = e.perms ? e.perms.split(",") : [];
        });

        render(deepTree(list));
      });
    }
  },
  (app) => {
    app.refresh();
  }
);

// cl-table 配置
const Table = useTable({
	contextMenu: [
		(row) => {
			return {
				label: "新增",
				hidden: row.type == 2,
				callback(done) {
					append(row);
					done();
				}
			};
		},
		"update",
		"delete",
		(row) => {
			return {
				label: "添加权限",
				hidden: row.type != 1,
				callback(done) {
					addPermission(row);
					done();
				}
			};
		}
	],
  columns: [
    {
      prop: "name",
      label: "名称",
      align: "left",
      width: 200
    },
    {
      prop: "icon",
      label: "图标",
      width: 80
    },
    {
      prop: "type",
      label: "类型",
      width: 100,
      dict: [
        {
          label: "目录",
          value: 0
        },
        {
          label: "菜单",
          value: 1,
          type: "success"
        },
        {
          label: "权限",
          value: 2,
          type: "danger"
        },
      ]
    },
    {
      prop: "router",
      label: "节点路由",
      minWidth: 160
    },
    {
      prop: "keepAlive",
      label: "路由缓存",
      width: 100
    },
    {
      prop: "viewPath",
      label: "文件路径",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      prop: "perms",
      label: "权限",
      headerAlign: "center",
      minWidth: 300
    },
    {
      prop: "orderNum",
      label: "排序号",
      width: 90
    },
    {
      prop: "updatedAt",
      label: "更新时间",
      sortable: "custom",
      width: 160
    },
    {
      label: "操作",
      type: "op",
      width: 250,
      buttons: ["slot-add", "edit", "delete"]
    }
  ]
});

// 行点击展开
function onRowClick(row, column) {
  if (column?.property && row.children) {
    Table.value?.toggleRowExpansion(row);
  }
}

// 子集新增
function append({ type, id }) {
	Crud.value?.rowAppend({
		parentId: id,
		parentType: type,
		type: type + 1,
		keepAlive: true,
		isShow: true
	});
}

// 设置权限
function addPermission({ id }) {
	Crud.value?.rowAppend({
		parentId: id,
		type: 2
	});
}
</script>
