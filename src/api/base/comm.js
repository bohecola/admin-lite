import request from "@/service/request";

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