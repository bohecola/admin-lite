import request from "/@/cool/service/request";

export default {
	add(data) {
		return request({
			url: "/blog/tag/add",
			method: "post",
			data
		});
	},
	delete(data) {
		return request({
			url: "/blog/tag/delete",
			method: "post",
			data
		});
	},
	update(data) {
		return request({
			url: "/blog/tag/update",
			method: "post",
			data
		});
	},
	info(params) {
		return request({
			url: "/blog/tag/info",
			method: "get",
			params
		});
	},
	list(data) {
		return request({
			url: "/blog/tag/list",
			method: "post",
			data
		});
	},
	page(data) {
		return request({
			url: "/blog/tag/page",
			method: "post",
			data
		});
	}
};
