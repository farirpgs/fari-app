import { useEffect, useRef, useState } from "react";

export function useDelayedIsLoading(isLoading: boolean) {
  const [isReallyLoading, setIsReallyLoading] = useState(false);
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (isLoading) {
      timeout.current = setTimeout(() => {
        setIsReallyLoading(true);
      }, 700);
      return () => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
      };
    } else {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      setIsReallyLoading(false);
    }
  }, [isLoading]);
  return isReallyLoading;
}
