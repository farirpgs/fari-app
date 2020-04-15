import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";

export function usePeerConnections(options: {
  peer: Peer;
  onHostDataReceive: (data: any) => void;
  debug?: boolean;
}) {
  const connection = useRef<Peer.DataConnection>(undefined);
  const [connectionToHost, setConnectionToHost] = useState<Peer.DataConnection>(
    undefined
  );
  const [connectingToHost, setConnectingToHost] = useState(false);
  const [connectingToHostError, setConnectingToHostError] = useState(false);

  useEffect(() => {
    function subscribeForEvents() {
      options.peer.on("error", onPeerErrorCallback);
      return () => {
        options.peer.off("error", onPeerErrorCallback);
        connection.current?.off("open", onHostConnectionOpen);
        connection.current?.off("close", onHostConnectionClose);
        connection.current?.off("data", onHostDataReceive);
      };
    }

    return subscribeForEvents();
  }, []);

  function onPeerErrorCallback(error: any) {
    if (error.type === "peer-unavailable") {
      setConnectingToHostError(true);
      setConnectingToHost(false);
    }
  }
  function onHostConnectionOpen() {
    setConnectionToHost(connection.current);
    setConnectingToHost(false);
    console.info("usePeerConnections: Connected To Host");
  }
  function onHostConnectionClose() {
    setConnectionToHost(undefined);
    setConnectingToHost(false);
    console.info("usePeerConnections: Disconnected From Host");
  }
  function onHostDataReceive(data: any) {
    options.onHostDataReceive(data);
  }

  return {
    state: {
      isConnectedToHost: !!connectionToHost,
      connectingToHost,
      connectingToHostError,
    },
    actions: {
      connect(id: string, metadata?: any) {
        console.info("Connection: Setup");
        setConnectingToHost(true);
        setConnectingToHostError(false);
        connection.current = options.peer.connect(id, {
          reliable: true,
          label: uuidV4(),
          metadata: metadata,
        });
        connection.current.on("open", onHostConnectionOpen);
        connection.current.on("close", onHostConnectionClose);
        connection.current.on("data", onHostDataReceive);
      },
      sendToHost(data: any) {
        connectionToHost.send(data);
      },
    },
  };
}
