<template>
	<div class="route-nav">
		<p v-if="app.browser.isMini" class="title">
			{{ lastName }}
		</p>

		<template v-else>
			<el-breadcrumb>
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item v-for="(item, index) in list" :key="index">{{
					item.meta?.label || item.name
				}}</el-breadcrumb-item>
			</el-breadcrumb>
		</template>
	</div>
</template>

<script name="route-nav" setup>
import { computed } from "vue";
import { flattenDeep, last } from "lodash-es";
import { useCool } from "/@/cool";
import { useBase } from "/$/base";

const { route } = useCool();
const { app, menu } = useBase();

// 数据列表
const list = computed(() => {
	function deep(item) {
		if (route.path === "/") {
			return false;
		}

		if (item.path == route.path) {
			return item;
		} else {
			if (item.children) {
				const ret = item.children.map(deep).find(Boolean);

				if (ret) {
					return [item, ret];
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	}

	return flattenDeep(menu.group).map(deep)
		.filter(Boolean);
});

// 最后一个节点名称
const lastName = computed(() => last(list.value)?.name);
</script>

<style lang="scss" scoped>
.route-nav {
	white-space: nowrap;

	.el-breadcrumb {
		margin: 0 10px;

		&__inner {
			font-size: 13px;
			padding: 0 10px;
			font-weight: normal;
			letter-spacing: 1px;
		}
	}

	.title {
		font-size: 15px;
		font-weight: 500;
		margin-left: 5px;
	}
}
</style>
