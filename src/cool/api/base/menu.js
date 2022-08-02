import request from "/@/cool/service/request";

export const list = (data) => request({
  url: "/sys/menu/list",
  method: "post",
  data
});

export const page = (data) => request({
  url: "/sys/menu/page",
  method: "post",
  data
});