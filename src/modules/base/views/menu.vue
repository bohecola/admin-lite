<template>
            <!-- ('crud') => (el) => { refs.value['crud'] = el; } -->
            <!-- (index) => (el) => { refs.value[index] = el; } -->
  <cl-crud :ref="setRefs('crud')" :on-refresh="onRefresh" @load="onLoad">
    <el-row>
			<cl-table :ref="setRefs('table')" v-bind="table" @row-click="onRowClick">
				<!-- 名称 -->
				<template #column-name="{ scope }">
					<span>{{ scope.row.name }}</span>
					<el-tag
						size="small"
						effect="dark"
						type="danger"
						v-if="!scope.row.isShow"
						style="margin-left: 10px"
						>隐藏</el-tag
					>
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
						size="small"
						effect="dark"
						style="margin: 2px; letter-spacing: 0.5px"
						>{{ item }}</el-tag
					>
				</template>

				<!-- 路由 -->
				<template #column-router="{ scope }">
					<el-link type="primary" :href="scope.row.router" v-if="scope.row.type == 1">{{
						scope.row.router
					}}</el-link>
					<span v-else>{{ scope.row.router }}</span>
				</template>

				<!-- 路由缓存 -->
				<template #column-keepAlive="{ scope }">
					<template v-if="scope.row.type == 1">
						<el-icon v-if="scope.row.keepAlive">
              <Check />
            </el-icon>
						<el-icon v-else><Close /></el-icon>
					</template>
				</template>

				<!-- 行新增 -->
				<template #slot-add="{ scope }">
					<el-button
						link
            type="primary"
						size="small"
						v-if="scope.row.type != 2"
						>新增</el-button
					>
				</template>
			</cl-table>
		</el-row>
  </cl-crud>
  <!-- <cl-dialog
    v-model="visible"
  >
  </cl-dialog> -->
</template>

<script setup>
import { service, useRefs } from "/@/cool";
import { deepTree } from "/@/cool/utils";
import { onMounted, reactive, ref } from "vue";

const { refs, setRefs } = useRefs();

function onLoad({ ctx, app }) {
  ctx.service(service.menu).done();
  app.refresh();
}

// 刷新监听
function onRefresh(_, { render }) {
  service.menu.list().then((list) => {
    list.map(e => {
      e.permList = e.perms ? e.perms.split(",") : [];
    });

    render(deepTree(list), {
      total: list.length
    });
  });
}

// 行点击展开
function onRowClick(row, column) {
  if (column.property && row.children) {
    refs.value.table.toggleRowExpansion(row);
  }
}

// 表格配置
const table = reactive({
  props: {
    "row-key": "id"
  },
  "context-menu": [
    (row) => {
      return {
        label: "新增",
        hidden: row.type == 2,
        callback: (_, done) => {
          upsertAppend(row);
          done();
        }
      };
    },
    "update",
    "delete",
    (row) => {
      return {
        label: "权限",
        hidden: row.type != 1,
        callback: (_, done) => {
          setPermission(row);
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
          value: 1
        },
        {
          label: "权限",
          value: 2
        }
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
      width: 150
    },
    {
      label: "操作",
      type: "op",
      buttons: ["slot-add", "edit", "delete"]
    }
  ]
});

const visible = ref(true);
</script>
