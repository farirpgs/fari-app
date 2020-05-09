import MagicGrid from "magic-grid";
import React, { useEffect, useRef } from "react";

export const MagicGridContainer: React.FC<{
  items: number;
  gutterPx: number;
}> = (props) => {
  const $gridContainer = useRef();

  useEffect(() => {
    const magicGrid = { current: null };
    const timeout = { current: null };

    if (!magicGrid.current && props.items !== 0) {
      magicGrid.current = new MagicGrid({
        container: $gridContainer.current,
        items: props.items,
        gutter: props.gutterPx,
      });
      magicGrid.current.positionItems();
      window.addEventListener("resize", resize);
    }

    function resize() {
      if (!timeout.current)
        timeout.current = setTimeout(() => {
          magicGrid.current?.positionItems();
          timeout.current = null;
        }, 200);
    }

    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  return <div ref={$gridContainer}>{props.children}</div>;
};

MagicGridContainer.displayName = "MagicGridContainer";
