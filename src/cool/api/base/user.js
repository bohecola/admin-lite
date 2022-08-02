import request from "/@/cool/service/request";

export const list = (data) => request({
  url: "/sys/user/list",
  method: "post",
  data
});