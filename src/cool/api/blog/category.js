import request from "/@/cool/service/request";

export default {
	add(data) {
		return request({
			url: "/blog/category/add",
			method: "post",
			data
		});
	},
	delete(data) {
		return request({
			url: "/blog/category/delete",
			method: "post",
			data
		});
	},
	update(data) {
		return request({
			url: "/blog/category/update",
			method: "post",
			data
		});
	},
	info(params) {
		return request({
			url: "/blog/category/info",
			method: "get",
			params
		});
	},
	list(data) {
		return request({
			url: "/blog/category/list",
			method: "post",
			data
		});
	},
	page(data) {
		return request({
			url: "/blog/category/page",
			method: "post",
			data
		});
	}
};
