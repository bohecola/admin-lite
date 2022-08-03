<template>
	<el-popover
		placement="bottom-start"
		width="100%"
		:teleported="false"
		popper-class="menu-icon"
		trigger="click"
	>
		<el-row :gutter="10" class="list scroller1">
			<el-col v-for="(item, index) in list" :key="index" :span="2" :xs="4">
				<el-tooltip
					:content="item"
				>
					<el-button :class="{ 'is-active': item === name }" @click="onChange(item)">
						<el-icon><component :is="item" /></el-icon>
					</el-button>
				</el-tooltip>
			</el-col>
		</el-row>

		<template #reference>
			<el-input v-model="name" placeholder="请选择" clearable @input="onChange" />
		</template>
	</el-popover>
</template>

<script name="menu-icon" setup>
import { ref, watch } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
	modelValue: {
		type: Number,
		default: ""
	}
});

function iconList() {
	const list = [];

	for (const i in ElementPlusIconsVue) {
		list.push(i);
	}

	return list;
}

// 图标列表
const list = ref(iconList());

// 已选图标
const name = ref(props.modelValue);

function onChange(val) {
	emit("update:modelValue", val);
}

watch(
	() => props.modelValue,
	(val) => {
		name.value = val;
	}
);
</script>

<style lang="scss">
.menu-icon {
	box-sizing: border-box;

	.el-button {
		margin-bottom: 10px;
		height: 40px;
		width: 100%;
		padding: 0;

		.cl-svg {
			font-size: 18px;
		}
	}
}
</style>
