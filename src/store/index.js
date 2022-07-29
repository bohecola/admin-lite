import { useAppStore } from "./app";
import { useMenuStore } from "./menu";
import { useUserStore } from "./user";

export function useStore() {
  const app = useAppStore();
  const menu = useMenuStore();
  const user = useUserStore();

  return {
    app,
    menu,
    user
  };
}