import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

export function usePeerJS(options: { debug?: boolean }) {
  const peer = useRef<Peer>(undefined);
  const [hostId, setHostId] = useState<string>(undefined);
  const [error, setError] = useState<any>(undefined);

  if (!peer.current) {
    peer.current = new Peer(undefined, { debug: options.debug ? 3 : 0 });
  }

  useEffect(() => {
    function setupPeer() {
      console.debug("PeerJS: Setup");

      peer.current.on("open", onPeerOpenCallback);
      peer.current.on("disconnected", onPeerDisconnectedCallback);
      peer.current.on("close", onPeerCloseCallback);
      peer.current.on("error", onPeerErrorCallback);

      return () => {
        peer.current.off("open", onPeerOpenCallback);
        peer.current.off("disconnected", onPeerDisconnectedCallback);
        peer.current.off("close", onPeerCloseCallback);
      };

      function onPeerOpenCallback(id: string) {
        setHostId(id);
        console.debug("PeerJS: Connection Established");
      }
      function onPeerDisconnectedCallback() {
        setHostId(undefined);
        setError("disconnected");
        console.debug("PeerJS: Connection lost. Please reconnect");
      }
      function onPeerCloseCallback() {
        setHostId(undefined);
        setError("close");
        console.debug("PeerJS: Connection destroyed");
      }
      function onPeerErrorCallback(error: any) {
        setHostId(undefined);
        setError(error);
        console.debug("PeerJS: Error", error);
      }
    }

    return setupPeer();
  }, []);

  return { state: { peer: peer.current, hostId, error } };
}
