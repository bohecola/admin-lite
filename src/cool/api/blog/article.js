import request from "/@/cool/service/request";

export default {
	add(data) {
		return request({
			url: "/blog/article/add",
			method: "post",
			data
		});
	},
	delete(data) {
		return request({
			url: "/blog/article/delete",
			method: "post",
			data
		});
	},
	update(data) {
		return request({
			url: "/blog/article/update",
			method: "post",
			data
		});
	},
	info(params) {
		return request({
			url: "/blog/article/info",
			method: "get",
			params
		});
	},
	list(data) {
		return request({
			url: "/blog/article/list",
			method: "post",
			data
		});
	},
	page(data) {
		return request({
			url: "/blog/article/page",
			method: "post",
			data
		});
	}
};