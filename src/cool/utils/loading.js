export const Loading = {
  resolve: null,

  next: null,

  async set(list) {
		try {
			await Promise.all(list);
		} catch (e) {}
    this.resolve();
  },

  async wait() {
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