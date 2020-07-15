import MagicGrid from "magic-grid";
import React, { useEffect, useRef } from "react";

const defaultMagicGridGutter = 0;
const magicGridUpdateDebounceMS = 200;

export const MagicGridContainer: React.FC<{
  items: number;
  gutterPx?: number;
}> = (props) => {
  const $gridContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const magicGrid: { current: MagicGrid | null } = { current: null };
    const timeout: { current: NodeJS.Timeout | null } = { current: null };

    if (!magicGrid.current && props.items !== 0) {
      magicGrid.current = new MagicGrid({
        container: $gridContainer.current!,
        items: props.items,
        gutter: props.gutterPx ?? defaultMagicGridGutter,
      });
      magicGrid.current.positionItems();
      window.addEventListener("resize", resize);
    }

    function resize() {
      if (!timeout.current)
        timeout.current = setTimeout(() => {
          magicGrid.current?.positionItems();
          timeout.current = null;
        }, magicGridUpdateDebounceMS);
    }

    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  return <div ref={$gridContainer}>{props.children}</div>;
};

MagicGridContainer.displayName = "MagicGridContainer";
