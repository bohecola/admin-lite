import { onBeforeUpdate, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { service } from "../service";
import { Data } from "../utils";

export function useService() {
	return Data.get("service", service);
}

export function useRefs() {
	const refs = ref([]);

	onBeforeUpdate(() => {
		refs.value = [];
	});

	const setRefs = (index) => (el) => {
		refs.value[index] = el;
	};

	return { refs, setRefs };
}

export function useCool() {
	return {
		service: useService(),
		route: useRoute(),
		router: useRouter(),
		mitt: inject("mitt"),
		...useRefs()
	};
}
