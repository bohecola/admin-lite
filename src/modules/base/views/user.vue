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
      <cl-table ref="Table" />
    </el-row>

    <el-row>
      <cl-flex1 />
      <cl-pagination />
    </el-row>

    <!-- 新增、编辑 -->
    <cl-upsert ref="Upsert" />
  </cl-crud>
</template>

<script setup>
import { useTable, useUpsert, useCrud } from "@cool-vue/crud";
import { computed, reactive } from "vue";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-crud 配置
const Crud = useCrud({
  service: service.user
}, (app) => {
  app.refresh()
});

// cl-table 配置
const Table = useTable({
  columns: [
    {
      type: "selection",
      width: 60
    },
    {
      prop: "avatar",
      label: "头像",
      component: {
        name: "cl-avatar"
      }
    },
    {
      prop: "name",
      label: "姓名",
      minWidth: 150
    },
    {
      prop: "username",
      label: "用户名",
      minWidth: 150
    },
    {
      prop: "nickName",
      label: "昵称",
      minWidth: 150
    },
    {
      prop: "roleName",
      label: "角色",
      headerAlign: "center",
      minWidth: 120
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
      prop: "phone",
      label: "手机号码",
      minWidth: 150
    },
		{
			prop: "remark",
			label: "备注",
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
})

// cl-upsert 配置
const Upsert = useUpsert({
  dialog: {
    width: "800px"
  },

  items: [
		{
      prop: "avatar",
      label: "头像",
      component: {
        name: "cl-upload-custom",
        props: {
					text: "选择头像"
        }
      }
    },
		{
			prop: "name",
			label: "姓名",
			span: 12,
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "nickName",
			label: "昵称",
			required: true,
			span: 12,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "username",
			label: "用户名",
			required: true,
			span: 12,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "password",
			label: "密码",
			span: 12,
			required: true,
			component: {
				name: "el-input",
				props: {
					type: "password"
				}
			},
			rules: [
				{
					min: 6,
					max: 16,
					message: "密码长度在 6 到 16 个字符"
				}
			]
		},
		{
			prop: "roleIdList",
			label: "角色",
			value: [],
			required: true,
			component: {
				name: "el-select",
				options: [],
				props: {
					multiple: true,
					"multiple-limit": 3
				}
			}
		},
		{
			prop: "phone",
			label: "手机号码",
			span: 12,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "email",
			label: "邮箱",
			span: 12,
			component: {
				name: "el-input"
			}
		},
		{
			prop: "remark",
			label: "备注",
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
			value: 1,
			component: {
				name: "el-radio-group",
				options: [
					{
						label: "开启",
						value: 1
					},
					{
						label: "关闭",
						value: 0
					}
				]
			}
		}
  ],

	async onOpen(isEdit) {
		const list = await service.role.list();

		// 设置权限列表
		Upsert.value?.setOptions(
			"roleIdList",
			list.map((e) => {
				return {
					label: e.name || "",
					value: e.id
				};
			})
		);

		// 编辑密码不必填
		if (isEdit) {
			Upsert.value?.setData("password", {
				rules: {
					required: false
				}
			});
		}
	}
});
</script>
