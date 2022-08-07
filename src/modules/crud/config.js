import Crud from "@cool-vue/crud";
import "@cool-vue/crud/dist/index.css";

export default () => {
	return {
		options: {
			crud: {
				dict: {
					sort: {
						prop: "prop",
						order: "order"
					}
				}
			}
		},
		install: Crud.install
	};
};
