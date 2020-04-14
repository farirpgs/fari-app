import Peer from "peerjs";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

export function usePeerConnections(options: {
  id?: string;
  peer: Peer;
  hostId: string;
  onHostDataReceive: (data: any) => void;
  debug?: boolean;
}) {
  const [connectionToHost, setConnectionToHost] = useState<Peer.DataConnection>(
    undefined
  );
  useEffect(() => {
    function setupAsConnection() {
      if (!options.hostId || !options.id) {
        return;
      }
      console.debug("Connection: Setup");
      const connection = options.peer.connect(options.id, {
        reliable: true,
        label: uuidV4(),
      });
      connection.on("open", onHostConnectionOpen);
      connection.on("close", onHostConnectionClose);
      connection.on("data", onHostDataReceive);
      return () => {
        connection.off("open", onHostConnectionOpen);
        connection.off("close", onHostConnectionClose);
        connection.off("data", onHostDataReceive);
      };
      function onHostConnectionOpen() {
        setConnectionToHost(connection);
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
    }
    return setupAsConnection();
  }, [options.hostId, options.id]);
  return {
    state: {
      isConnectedToHost: !!connectionToHost,
    },
    actions: {
      sendToHost(action: any) {
        connectionToHost.send(action);
      },
    },
  };
}
