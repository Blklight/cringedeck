"use client";

import { useCallback, useRef, useState } from "react";

type UseControllableStateParams<T> = {
  prop?: T;
  defaultProp?: T;
  onChange?: (state: T) => void;
};

type SetStateFn<T> = (value: T | ((prev: T) => T)) => void;

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>): [T, SetStateFn<T>] {
  const [uncontrolledProp, setUncontrolledProp] = useState<T | undefined>(
    defaultProp,
  );
  const isControlled = prop !== undefined;
  const value = (isControlled ? prop : uncontrolledProp) as T;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback<SetStateFn<T>>(
    (next) => {
      const resolve = (prev: T) =>
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;

      if (isControlled) {
        const nextValue = resolve(prop as T);
        if (nextValue !== prop) {
          onChangeRef.current?.(nextValue);
        }
        return;
      }

      setUncontrolledProp((prev) => {
        const nextValue = resolve(prev as T);
        if (nextValue !== prev) {
          onChangeRef.current?.(nextValue);
        }
        return nextValue;
      });
    },
    [isControlled, prop],
  );

  return [value, setValue];
}
