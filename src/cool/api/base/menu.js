import request from "/@/cool/service/request";

export default {
  add(data) {
    return request({
      url: "/sys/menu/add",
      method: "post",
      data
    })
  },
  delete(data) {
    return request({
      url: "/sys/menu/delete",
      method: "post",
      data
    })
  },
  update(data) {
    return request({
      url: "/sys/menu/update",
      method: "post",
      data
    })
  },
  info(params) {
    return request({
      url: "/sys/menu/info",
      method: "get",
      params
    })
  },
  list(data) {
    return request({
      url: "/sys/menu/list",
      method: "post",
      data
    })
  },
  page(data) {
    return request({
      url: "/sys/menu/page",
      method: "post",
      data
    })
  }
}