import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { getQueryClient } from "@/lib/query-client";

describe("getQueryClient", () => {
  it("returns a QueryClient instance", () => {
    expect(getQueryClient()).toBeInstanceOf(QueryClient);
  });

  it("reuses the same instance on the browser", () => {
    expect(getQueryClient()).toBe(getQueryClient());
  });

  it("does not retry 401 errors", () => {
    const client = getQueryClient();
    const retry = client.getDefaultOptions().queries?.retry;
    expect(typeof retry).toBe("function");

    const retryFn = retry as (count: number, error: unknown) => boolean;
    expect(retryFn(0, { response: { status: 401 } })).toBe(false);
    expect(retryFn(0, { response: { status: 500 } })).toBe(true);
    expect(retryFn(1, { response: { status: 500 } })).toBe(false);
  });

  it("does not retry 401 mutation errors", () => {
    const client = getQueryClient();
    const retry = client.getDefaultOptions().mutations?.retry;
    const retryFn = retry as (count: number, error: unknown) => boolean;

    expect(retryFn(0, { response: { status: 401 } })).toBe(false);
    expect(retryFn(0, new Error("boom"))).toBe(true);
  });

  it("configures a five minute stale time", () => {
    expect(getQueryClient().getDefaultOptions().queries?.staleTime).toBe(
      1000 * 60 * 5,
    );
  });
});
