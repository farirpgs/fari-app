import { useEffect, useRef, useState } from "react";

export function useDelayedIsLoading(isLoading: boolean) {
  const [isReallyLoading, setIsReallyLoading] = useState(false);
  const timeout = useRef(undefined);
  useEffect(() => {
    if (isLoading) {
      timeout.current = setTimeout(() => {
        setIsReallyLoading(true);
      }, 700);
      return () => clearTimeout(timeout.current);
    } else {
      clearTimeout(timeout.current);
      setIsReallyLoading(false);
    }
  }, [isLoading]);
  return isReallyLoading;
}
