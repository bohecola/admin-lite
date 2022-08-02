import request from "/@/cool/service/request";

export const list = (data) => request({
  url: "/sys/role/list",
  method: "post",
  data
});