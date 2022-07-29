import request from "@/service/request";

export const list = (params) => request({
  url: "/sys/menu/list",
  method: "get",
  params
});

export const page = (params) => request({
  url: "/sys/menu/page",
  method: "get",
  params
});