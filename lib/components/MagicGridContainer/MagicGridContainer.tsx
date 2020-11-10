import MagicGrid from "magic-grid";
import React, { useEffect, useRef } from "react";

const DefaultMagicGridGutter = 0;
const MagicGridUpdateDebounceMS = 200;

export const MagicGridContainer: React.FC<{
  items: number;
  gutterPx?: number;
  deps: Array<any>;
}> = (props) => {
  const $gridContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const magicGrid: { current: MagicGrid | null } = { current: null };
    const timeout: { current: NodeJS.Timeout | null } = { current: null };

    if (!magicGrid.current && props.items !== 0) {
      magicGrid.current = new MagicGrid({
        container: $gridContainer.current!,
        items: props.items,
        gutter: props.gutterPx ?? DefaultMagicGridGutter,
      });
      window.addEventListener("resize", resize);
      setTimeout(() => {
        resize();
      });
    }

    function resize() {
      if (!timeout.current)
        timeout.current = setTimeout(() => {
          magicGrid.current?.positionItems();
          timeout.current = null;
        }, MagicGridUpdateDebounceMS);
    }

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [props.items, props.gutterPx, ...props.deps]);

  return <div ref={$gridContainer}>{props.children}</div>;
};

MagicGridContainer.displayName = "MagicGridContainer";
