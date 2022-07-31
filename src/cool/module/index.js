import { Data } from "../utils";

// 数据列表
const list = Data.get("modules", []);

// 模块
const module = {
  list,
  req: Promise.resolve(),
  get(name) {
    return this.list.find((e) => e.name == name);
  },
  add(data) {
    this.list.push(data);
  },
  wait() {
    return this.req;
  }
};

export { module };