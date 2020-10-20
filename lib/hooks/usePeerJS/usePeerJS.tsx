import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { env } from "../../constants/env";

export function usePeerJS(options: { debug?: boolean }) {
  const peer = useRef<Peer | undefined>(undefined);
  const [hostId, setHostId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(undefined);

  if (!peer.current) {
    const id = uuidV4();
    if (env.context === "localhost") {
      peer.current = new Peer(id, {
        // ONLY USE IF NEEDED BECAUSE $$$
        // host: "fari-peer-server-staging.herokuapp.com",
        host: "fari-peer-server.herokuapp.com",
        secure: true,
        path: "/peer/connect",
        debug: options.debug ? 3 : 0,
      });
    } else {
      peer.current = new Peer(id, {
        host: "fari-peer-server.herokuapp.com",
        secure: true,
        path: "/peer/connect",
        debug: options.debug ? 3 : 0,
      });
    }
  }

  useEffect(() => {
    function setupPeer() {
      console.info("usePeerJS: Setup");

      peer.current?.on("open", onPeerOpenCallback);
      peer.current?.on("disconnected", onPeerDisconnectedCallback);
      peer.current?.on("close", onPeerCloseCallback);
      peer.current?.on("error", onPeerErrorCallback);

      return () => {
        peer.current?.off("open", onPeerOpenCallback);
        peer.current?.off("disconnected", onPeerDisconnectedCallback);
        peer.current?.off("close", onPeerCloseCallback);
        peer.current?.destroy();
      };

      function onPeerOpenCallback(id: string) {
        setHostId(id);
        setLoading(false);
        console.info("usePeerJS: Connection Opened");
      }
      function onPeerDisconnectedCallback() {
        setHostId(undefined);
        peer.current?.reconnect();
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

export function isWebRTCSupported() {
  return RTCPeerConnection !== undefined;
}
