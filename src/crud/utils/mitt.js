import mitt from "mitt";

const emitter = mitt();

class Emitter {
  id = null;

  constructor(id) {
    this.id = id || 0;
  }

  send(type, name, ...args) {
    emitter[type](`${this.id}__${name}`, ...args);
  }

  on(name, ...args) {
    this.send("on", name, ...args);
  }

  emit(name, ...args) {
    this.send("emit", name, ...args);
  }

  off(name, ...args) {
    this.send("off", name, ...args);
  }
}

export default Emitter;