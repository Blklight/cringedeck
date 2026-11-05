import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const post = vi.fn();
const clear = vi.fn();

vi.mock("@/lib/api-client", () => ({
  apiClient: { post: (...args: unknown[]) => post(...args) },
}));

vi.mock("@/lib/query-client", () => ({
  getQueryClient: () => ({ clear }),
}));

const clearSession = vi.fn();

vi.mock("@/store/useAuthStore", () => ({
  useAuthStore: {
    getState: () => ({ clearSession }),
  },
}));

describe("session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clears local session and cancels queries", async () => {
    const { endSessionLocal } = await import("@/lib/session");

    endSessionLocal();

    expect(clearSession).toHaveBeenCalledTimes(1);
    expect(clear).toHaveBeenCalledTimes(1);
  });

  it("calls logout endpoint and clears the session", async () => {
    post.mockResolvedValueOnce({});
    const { logout } = await import("@/lib/session");

    await logout();

    expect(post).toHaveBeenCalledWith("/api/v1/auth/logout");
    expect(clearSession).toHaveBeenCalledTimes(1);
  });

  it("still clears the session when logout fails", async () => {
    post.mockRejectedValueOnce(new Error("network"));
    const { logout } = await import("@/lib/session");

    await expect(logout()).resolves.toBeUndefined();
    expect(clearSession).toHaveBeenCalledTimes(1);
  });
});
