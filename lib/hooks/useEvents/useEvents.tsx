import { useCallback, useLayoutEffect, useRef } from "react";

export function useEvent<TArgs extends any[], TReturn>(
  handler: (...args: TArgs) => TReturn
) {
  const handlerRef = useRef<(...args: TArgs) => TReturn>(handler);

  // In a real implementation, this would run before layout effects
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: TArgs) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current;
    return fn(...args);
  }, []);
}
