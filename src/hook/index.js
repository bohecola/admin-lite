import { useRoute, useRouter } from "vue-router";
import { useService } from "../service";

const service = useService();

export function useCool() {
  // 路由
  const route = useRoute();

  // 路由器
  const router = useRouter();

  return {
    route,
    router,
    service
  }
}