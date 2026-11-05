import { apiClient } from "@/lib/api-client";
import { getQueryClient } from "@/lib/query-client";
import { useAuthStore } from "@/store/useAuthStore";

export function endSessionLocal() {
  useAuthStore.getState().clearSession();
  try {
    getQueryClient().clear();
  } catch {}
}

export async function logout() {
  try {
    await apiClient.post("/api/v1/auth/logout");
  } catch {
    // best-effort: ignore network/401 errors
  }

  endSessionLocal();
}
