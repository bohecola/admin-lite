import request from "/@/cool/service/request";

export default {
	add(data) {
		return request({
			url: "/sys/role/add",
			method: "post",
			data
		});
	},
	delete(data) {
		return request({
			url: "/sys/role/delete",
			method: "post",
			data
		});
	},
	update(data) {
		return request({
			url: "/sys/role/update",
			method: "post",
			data
		});
	},
	info(params) {
		return request({
			url: "/sys/role/info",
			method: "get",
			params
		});
	},
	list(data) {
		return request({
			url: "/sys/role/list",
			method: "post",
			data
		});
	},
	page(data) {
		return request({
			url: "/sys/role/page",
			method: "post",
			data
		});
	}
};
