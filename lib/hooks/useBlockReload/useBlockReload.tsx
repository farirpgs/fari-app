import { useEffect } from "react";

export function useBlockReload(predicate: boolean) {
  useEffect(() => {
    if (predicate) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [predicate]);
}
