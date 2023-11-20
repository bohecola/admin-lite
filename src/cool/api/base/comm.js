import request from "/@/cool/service/request";

export const personUpdate = (data) => request({
	url: "/comm/personUpdate",
	method: "post",
	data
});

export const person = () => request({
	url: "/comm/person",
	method: "get"
});

export const permmenu = () => request({
	url: "/comm/permmenu",
	method: "get"
});

export const upload = (data) => request({
	url: "/comm/upload",
	header: { "Content-Type": "multipart/form-data" },
	method: "post",
	data
});

export const uploadChunk = (data) => request({
	url: "/upload/chunk",
	header: { "Content-Type": "multipart/form-data" },
	method: "post",
	data
});

export const mergeChunk = (data) => request({
	url: "/upload/merge",
	method: "post",
	data
});
