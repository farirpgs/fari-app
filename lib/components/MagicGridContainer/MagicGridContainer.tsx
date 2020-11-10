import MagicGrid from "magic-grid";
import React, { useEffect, useRef } from "react";

const DefaultMagicGridGutter = 0;
const RefreshIntervalRate = 2000;
const MagicGridUpdateDebounceMS = 200;

export const MagicGridContainer: React.FC<{
  items: number;
  gutterPx?: number;
}> = (props) => {
  const $gridContainer = useRef<HTMLDivElement | null>(null);
  const refreshInterval = useRef<any | undefined>(undefined);

  useEffect(() => {
    const magicGrid: { current: MagicGrid | null } = { current: null };
    const timeout: { current: NodeJS.Timeout | null } = { current: null };

    if (!magicGrid.current && props.items !== 0) {
      magicGrid.current = new MagicGrid({
        container: $gridContainer.current!,
        items: props.items,
        gutter: props.gutterPx ?? DefaultMagicGridGutter,
      });
      magicGrid.current.positionItems();
      window.addEventListener("resize", resize);
    }

    clearInterval(refreshInterval.current);
    refreshInterval.current = setInterval(() => {
      resize();
    }, RefreshIntervalRate);

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
  });

  return <div ref={$gridContainer}>{props.children}</div>;
};

MagicGridContainer.displayName = "MagicGridContainer";
