export const Loading = {
  resolve: null,

  next: null,

  async set(list) {
    await Promise.all(list);
    this.resolve();
  },

  wait() {
    return this.next;
  },

  close() {
    const el = document.getElementById("Loading");

    if (el) {
      el.style.display = "none";
    }
  }
};

Loading.next = new Promise((resolve) => {
  Loading.resolve = resolve;
});