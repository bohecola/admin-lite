<template>
	<div class="cl-avatar" :class="[size, shape]" :style="[style]">
		<el-image :src="modelValue || src" alt="头像">
			<template #error>
				<div class="image-slot">
					<el-icon :size="20" :color="color"><user /></el-icon>
				</div>
			</template>
		</el-image>
	</div>
</template>

<script>
import { computed, defineComponent } from "vue";
import { isNumber } from "lodash-es";
import { User } from "@element-plus/icons-vue";

export default defineComponent({
	name: "cl-avatar",

	components: { User },

	props: {
		modelValue: String,
		src: String,
		size: {
			type: [String, Number],
			default: 36
		},
		shape: {
			type: String,
			default: "square"
		},
		backgroundColor: {
			type: String,
			default: "#f7f7f7"
		},
		color: {
			type: String,
			default: "#ccc"
		}
	},

	setup(props) {
		const size = isNumber(props.size) ? props.size + "px" : props.size;

		const style = computed(() => {
			return {
				height: size,
				width: size,
				backgroundColor: props.backgroundColor
			};
		});

		return { style };
	}
});
</script>

<style lang="scss" scoped>
.cl-avatar {
	overflow: hidden;
	margin: 0 auto;

	&.large {
		height: 50px;
		width: 50px;
	}

	&.medium {
		height: 40px;
		width: 40px;
	}

	&.small {
		height: 30px;
		width: 30px;
	}

	&.circle {
		border-radius: 100%;
	}

	&.square {
		border-radius: 10%;
	}

	img {
		height: 100%;
		width: 100%;
	}

	.el-image {
		height: 100%;
		width: 100%;
		:deep(.el-image__inner) {
			object-fit: cover;
		}

		.image-slot {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 100%;
		}
	}
}
</style>
