import { useEffect, useState } from "react";

export function useElementWidth(ref: React.RefObject<HTMLElement>) {
  const [width, setWidth] = useState<number>(0);
  useEffect(() => {
    handleResize();
    function handleResize() {
      if (ref.current) {
        setWidth(ref.current.clientWidth);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
}
