import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useIsMobile } from "@/hooks/use-mobile";

function mockMatchMedia(matches: boolean) {
  const listeners: Array<() => void> = [];
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: (_: string, cb: () => void) => listeners.push(cb),
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => true,
    }),
  });
  return listeners;
}

function setWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    value: width,
  });
}

describe("useIsMobile", () => {
  it("returns true when the viewport is narrower than the breakpoint", () => {
    setWidth(500);
    mockMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false when the viewport is wider than the breakpoint", () => {
    setWidth(1200);
    mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("reacts to media query change events", () => {
    setWidth(1200);
    const listeners = mockMatchMedia(false);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => {
      setWidth(400);
      for (const listener of listeners) {
        listener();
      }
    });

    expect(result.current).toBe(true);
  });
});
