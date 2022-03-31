import { useMyPresence, useOthers } from "@liveblocks/react";
import { useContext, useEffect } from "react";
import { SessionPresenceUpdaterContext } from "../contexts/SessionPresenceContext";
import { IPlayerPresence } from "../types/IPlayerPresence";

export function useWindowLiveCursors() {
  const sessionPresenceUpdater = useContext(SessionPresenceUpdaterContext);

  useEffect(() => {
    const scroll = {
      x: window.scrollX,
      y: window.scrollY,
    };

    let lastPosition: { x: any; y: any } | null = null;

    function transformPosition(point: { x: any; y: any }) {
      return {
        x: point.x / window.innerWidth,
        y: point.y,
      };
    }

    function onPointerMove(event: { pageX: any; pageY: any }) {
      const position = {
        x: event.pageX,
        y: event.pageY,
      };
      lastPosition = position;
      sessionPresenceUpdater.actions.updateMyPresence({
        cursor: transformPosition(position),
      });
    }

    function onPointerLeave() {
      // lastPosition = null;
      // sessionPresenceUpdater.actions.updateMyPresence({ cursor: null });
    }

    function onDocumentScroll() {
      if (lastPosition) {
        const offsetX = window.scrollX - scroll.x;
        const offsetY = window.scrollY - scroll.y;
        const position = {
          x: lastPosition.x + offsetX,
          y: lastPosition.y + offsetY,
        };
        lastPosition = position;
        sessionPresenceUpdater.actions.updateMyPresence({
          cursor: transformPosition(position),
        });
      }
      scroll.x = window.scrollX;
      scroll.y = window.scrollY;
    }

    document.addEventListener("scroll", onDocumentScroll);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.removeEventListener("scroll", onDocumentScroll);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  const others = useOthers();

  return others
    .toArray()
    .filter((user) => user.presence?.cursor != null)
    .map(({ connectionId, presence, id, info }) => {
      return {
        x: presence?.cursor.x * window.innerWidth,
        y: presence?.cursor.y,
        connectionId,
        id,
        info,
        presence,
      };
    });
}

export function useMyWindowLiveCursor() {
  const [presence] = useMyPresence<IPlayerPresence>();

  if (!presence.cursor) {
    return null;
  }
  return {
    x: presence.cursor.x * window.innerWidth,
    y: presence.cursor.y,
  };
}
