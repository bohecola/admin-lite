import { isString, isBoolean, isFunction } from "./index";

export default function(method, { value, scope, data = {} }) {
  if (data) {
    data.isAdd = !data.isEdit;
  }

  if (method === "hidden") {
    if (isBoolean(value)) {
      return value;
    } else if (isString(value)) {
      const prop = value.substring(1, value.length);

      switch(value[0]) {
        case "@":
          return !scope[prop];
        case ":":
          return data[prop];
      }
    } else if (isFunction(value)) {
      return value({ scope, ...data });
    }

    return false;
  }
}