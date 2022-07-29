import request from "@/service/request";

export const login = (data) => request({
  url: "/open/login",
  method: "post",
  data
});

export const refreshToken = (data) => request({
  url: "/open/refreshToken",
  method: "post",
  data
})