import request from "/@/cool/service/request";

export const login = (data) => request({
	url: "/open/login",
	method: "post",
	data
});

export const refreshToken = (data) => request({
	url: "/open/refreshToken",
	method: "post",
	data
});

export const captcha = (params) => request({
	url: "/open/captcha",
	method: "get",
	params
});

export const qrcode = (params) => request({
	url: "/open/qrcode",
	method: "get",
	params
});

export const qrcodePoll = (params) => request({
	url: "/open/qrcodePoll",
	method: "get",
	params
});
