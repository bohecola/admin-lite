import request from "@/service/request";

export const list = (params) => request({
  url: "/sys/user/list",
  method: "get",
  params
});