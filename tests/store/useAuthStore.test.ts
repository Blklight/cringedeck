import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/types/api.types";

const user: User = {
  id: "u_1",
  email: "ada@example.com",
  username: "ada",
  emailVerified: true,
  role: "user",
  onboardingComplete: true,
  createdAt: "2024-01-01T00:00:00.000Z",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  });

  it("starts unauthenticated", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("sets the session", () => {
    act(() => useAuthStore.getState().setSession(user, "token-123"));

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.accessToken).toBe("token-123");
    expect(state.isAuthenticated).toBe(true);
  });

  it("clears the session", () => {
    act(() => useAuthStore.getState().setSession(user, "token-123"));
    act(() => useAuthStore.getState().clearSession());

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("updates only the user", () => {
    act(() => useAuthStore.getState().setSession(user, "token-123"));

    const updated: User = { ...user, username: "grace" };
    act(() => useAuthStore.getState().setUser(updated));

    const state = useAuthStore.getState();
    expect(state.user?.username).toBe("grace");
    expect(state.accessToken).toBe("token-123");
    expect(state.isAuthenticated).toBe(true);
  });

  it("persists the session to localStorage", () => {
    act(() => useAuthStore.getState().setSession(user, "token-123"));

    const raw = localStorage.getItem("blklight-auth");
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw as string).state.accessToken).toBe("token-123");
  });

  it("is consumable through a hook", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(false);

    act(() => result.current.setSession(user, "token-123"));
    expect(result.current.isAuthenticated).toBe(true);
  });
});
