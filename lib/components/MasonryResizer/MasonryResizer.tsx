import { useEffect } from "react";

export function MasonryResizer(props: { deps: Array<unknown> }) {
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, props.deps);

  return null;
}
