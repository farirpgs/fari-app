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

  useEffect(() => {
    if (connection.current) {
      connection.current.off("open", onHostConnectionOpen);
      connection.current.off("close", onHostConnectionClose);
      connection.current.off("data", onHostDataReceive);
    }
  }, []);

  function onHostConnectionOpen() {
    setConnectionToHost(connection.current);
    console.debug("Connection: Connected To Host");
  }
  function onHostConnectionClose() {
    setConnectionToHost(undefined);
    console.debug("Connection: Disconnected From Host");
  }
  function onHostDataReceive(data: any) {
    options.onHostDataReceive(data);
    console.debug("Connection: Received Data", data);
  }

  return {
    state: {
      isConnectedToHost: !!connectionToHost,
    },
    actions: {
      connect(id: string, metadata?: any) {
        console.debug("Connection: Setup");
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
