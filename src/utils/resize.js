import { useStore } from "../store";
import { useEventListener } from "@vueuse/core";

function resize() {
  const { app } = useStore();
  app.setBrowser();
  app.isFold = app.browser.isMini;
}

window.onload = function () {
  useEventListener(window, "resize", resize);
  resize();
};
