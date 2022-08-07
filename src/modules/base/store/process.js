import { defineStore } from "pinia";
import { ref } from "vue";

export const useProcessStore = defineStore("process", function () {
	const list = ref([]);

	// 添加
	function add(data) {
		if (data.path != "/" && data.meta?.process !== false) {
			const index = list.value.findIndex((e) => e.path === data.path);

			list.value.forEach((e) => {
				e.active = false;
			});

			if (index < 0) {
				list.value.push({
					...data,
					active: true
				});
			} else {
				Object.assign(list.value[index], data, { active: true });
			}
		}
	}

	// 移除
	function remove(index) {
		list.value.splice(index, 1);
	}

	// 设置
	function set(data) {
		list.value = data;
	}

	// 清空
	function clear() {
		list.value = [];
	}

	// 设置标题
	function setTitle(title) {
		const item = list.value.find((e) => e.active);

		if (item) {
			item.meta.label = title;
		}
	}

	return {
		list,
		add,
		remove,
		set,
		clear,
		setTitle
	};
});
