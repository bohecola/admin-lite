import request from "@/service/request";

export const list = (params) => request({
  url: "/sys/role/list",
  method: "get",
  params
});