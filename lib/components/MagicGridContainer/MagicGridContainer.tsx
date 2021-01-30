import MagicGrid from "magic-grid";
import React, { useEffect, useRef } from "react";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { useMounted } from "../../hooks/useMounted/useMounted";

const DefaultMagicGridGutter = 0;
const MagicGridUpdateDebounceMS = 200;

export const MagicGridContainer: React.FC<{
  items: number;
  gutterPx?: number;
  deps: Array<any>;
}> = (props) => {
  const isMounted = useMounted();
  const logger = useLogger();
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

      positionItems();

      setTimeout(() => {
        if (isMounted) {
          positionItems();
        }
      });

      window.addEventListener("resize", resize);
    }

    function resize() {
      if (!timeout.current)
        timeout.current = setTimeout(() => {
          positionItems();
          timeout.current = null;
        }, MagicGridUpdateDebounceMS);
    }

    function positionItems() {
      try {
        magicGrid.current?.positionItems();
      } catch (error) {
        logger.error("MagicGridContainer:error", error);
      }
    }

    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  return <div ref={$gridContainer}>{props.children}</div>;
};

MagicGridContainer.displayName = "MagicGridContainer";
