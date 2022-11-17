import request from "/@/cool/service/request";

export default {
	add(data) {
		return request({
			url: "/sys/user/add",
			method: "post",
			data
		});
	},
	delete(data) {
		return request({
			url: "/sys/user/delete",
			method: "post",
			data
		});
	},
	update(data) {
		return request({
			url: "/sys/user/update",
			method: "post",
			data
		});
	},
	info(params) {
		return request({
			url: "/sys/user/info",
			method: "get",
			params
		});
	},
	list(data) {
		return request({
			url: "/sys/user/list",
			method: "post",
			data
		});
	},
	page(data) {
		return request({
			url: "/sys/user/page",
			method: "post",
			data
		});
	}
};