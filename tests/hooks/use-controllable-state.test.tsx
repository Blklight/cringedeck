import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "@/hooks/use-controllable-state";

describe("useControllableState", () => {
  it("uses the default prop when uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultProp: "initial" }),
    );
    expect(result.current[0]).toBe("initial");
  });

  it("updates internal state when uncontrolled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultProp: 0, onChange }),
    );

    act(() => result.current[1](1));

    expect(result.current[0]).toBe(1);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("supports functional updates when uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultProp: 2 }),
    );

    act(() => result.current[1]((prev) => prev + 3));

    expect(result.current[0]).toBe(5);
  });

  it("stays controlled and notifies on change", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ prop }) => useControllableState({ prop, onChange }),
      { initialProps: { prop: "a" } },
    );

    expect(result.current[0]).toBe("a");

    act(() => result.current[1]("b"));
    expect(result.current[0]).toBe("a");
    expect(onChange).toHaveBeenCalledWith("b");

    rerender({ prop: "b" });
    expect(result.current[0]).toBe("b");
  });

  it("does not notify when the controlled value does not change", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ prop: "same", onChange }),
    );

    act(() => result.current[1]("same"));

    expect(onChange).not.toHaveBeenCalled();
  });
});
