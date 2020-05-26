import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { env } from "../../services/injections";

export function usePeerJS(options: { debug?: boolean }) {
  const peer = useRef<Peer>(undefined);
  const [hostId, setHostId] = useState<string>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(undefined);

  if (!peer.current) {
    if (env.context === "localhost") {
      peer.current = new Peer(undefined, {
        host: "localhost",
        port: 9000,
        path: "/",
        debug: options.debug ? 3 : 0,
      });
    } else {
      peer.current = new Peer(undefined, {
        debug: options.debug ? 3 : 0,
      });
    }
  }

  useEffect(() => {
    function setupPeer() {
      console.info("usePeerJS: Setup");

      peer.current.on("open", onPeerOpenCallback);
      peer.current.on("disconnected", onPeerDisconnectedCallback);
      peer.current.on("close", onPeerCloseCallback);
      peer.current.on("error", onPeerErrorCallback);

      return () => {
        peer.current.off("open", onPeerOpenCallback);
        peer.current.off("disconnected", onPeerDisconnectedCallback);
        peer.current.off("close", onPeerCloseCallback);
        peer.current.destroy();
      };

      function onPeerOpenCallback(id: string) {
        setHostId(id);
        setLoading(false);
        console.info("usePeerJS: Connection Opened");
      }
      function onPeerDisconnectedCallback() {
        setHostId(undefined);
        peer.current.reconnect();
        console.info("usePeerJS: Disconnected. Reconnecting");
      }
      function onPeerCloseCallback() {
        setHostId(undefined);
        console.info("usePeerJS: Connection Closed");
      }
      function onPeerErrorCallback(error: any) {
        if (error.type === "server-error") {
          setError(error);
        }
        console.info("usePeerJS: Error", error.type);
      }
    }

    return setupPeer();
  }, []);

  return { peer: peer.current, hostId, loading, error };
}
